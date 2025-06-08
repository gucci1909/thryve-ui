import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import yargs from 'yargs/yargs';
import helmet from 'helmet';
import swaggerJsdoc from 'swagger-jsdoc';
import healthRoutes from './api/health/health.js';
import leaderShipRoutes from './api/leadership-report/leadership-report.js';
import userRoutes from './api/register/signup.js';
import authRoutes from './api/register/login.js';
import { hideBin } from 'yargs/helpers';
import swaggerUi from 'swagger-ui-express';
import logger from './utils/logger.js';
import chatBoxRoutes from './api/chat-box/chat-box.js';
import companyRoutes from './api/companies/companies.js';
import goalRoutes from './api/goals/goals.js';
import inviteTeamRoutes from './api/invite-team/invite-team.js';
import feedRoutes from './api/feed/explore.js';
import { connectToDb, getDb } from './config/db.js';
import authenticate from './middleware/authenticate.js';
import { v4 as uuidv4 } from 'uuid';
import { initializeChangeStream } from './controllers/chat-box/sse-controller.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const argv = yargs(hideBin(process.argv))
  .option('envFilePath', {
    alias: 'e',
    describe: 'Path to the .env file',
    type: 'string',
    demandOption: true,
  })
  .option('mode', {
    alias: 'm',
    describe: 'Application mode (e.g., development, production)',
    type: 'string',
  })
  .parse();

if (!argv.envFilePath || !argv.mode) {
  console.error('Missing envPath or mode. Exiting...');
  process.exit(1);
}

dotenv.config({ path: argv.envFilePath });

if (!argv.mode) {
  console.error("Error: Missing 'mode' argument.");
  process.exit(1);
}

if (!['dev', 'stg', 'prod'].includes(argv.mode)) {
  console.error("Error: Invalid mode passed. Choose 'dev', 'stg', or 'prod'.");
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
const app = express();

const allowedOrigins = {
  dev: process.env.DEV_CORS_ORIGIN || 'http://localhost:5173',
  stg: process.env.STG_CORS_ORIGIN || 'http://localhost:5173',
  prod: process.env.PROD_CORS_ORIGIN
};

app.use(
  cors({
    origin: allowedOrigins[argv.mode],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }),
);

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});

app.use((req, res, next) => {
  const requestLogger = logger.withRequestContext(req);

  // Log request
  requestLogger.info('Incoming request');

  // Log response
  res.on('finish', () => {
    requestLogger.info('Request completed', {
      statusCode: res.statusCode,
      responseTime: Date.now() - req._startTime,
      contentLength: res.get('Content-Length'),
    });
  });

  // Log errors
  res.on('error', (error) => {
    requestLogger.error('Response error', error);
  });

  req._startTime = Date.now();
  next();
});

const swaggerOptions = {
  definition: {
    info: {
      title: 'Broker Management API',
      version: '0.0.1',
      description: 'API documentation for the Broker Management system',
    },
  },
  apis: ['./src/api/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', healthRoutes);

app.use('/api/onboarding', leaderShipRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/companies', companyRoutes);
app.use('/api/chat-box', chatBoxRoutes);

app.use('/api/goals-list', goalRoutes);
app.use('/api/invite-team', inviteTeamRoutes);

app.use('/api/feed', feedRoutes);

// Add SSE endpoint for points updates
app.get('/api/points-stream',  async (req, res) => {
  // Set CORS headers specifically for SSE
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins[argv.mode]);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  

  console.log(req.cookies);
  // Get token from cookies
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Verify token and get user
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
     const userId = req.user.id;
     
     // Set SSE headers
     res.writeHead(200, {
       'Content-Type': 'text/event-stream',
       'Connection': 'keep-alive',
       'Cache-Control': 'no-cache',
       'X-Accel-Buffering': 'no' // Disable buffering for nginx
     });
 
     // Get initial points value
     const db = getDb();
     const interactionsCollection = db.collection('interactions');
     const existingInteraction = await interactionsCollection.findOne({
       user_id: userId
     });
     
     const initialPoints = existingInteraction?.points || 0;
     
     // Send initial points
     res.write(`data: ${JSON.stringify({ points: initialPoints })}\n\n`);
 
     // Store the client connection
     const clients = req.app.locals.clients || new Map();
     
     if (!clients.has(userId)) {
       clients.set(userId, new Set());
     }
     
     const userClients = clients.get(userId);
     
     // Create a new client object and add to the Set
     const newClient = {
       id: Date.now(), // Simple unique identifier
       res
     };
     
     userClients.add(newClient);
     req.app.locals.clients = clients;
 
     // Handle client disconnect
     req.on('close', () => {
       userClients.delete(newClient);
       if (userClients.size === 0) {
         clients.delete(userId);
       }
       console.log(`Client ${newClient.id} disconnected`);
     });
 
   } catch (error) {
     console.error('SSE Connection Error:', error);
     res.status(500).end();
   }
});

app.listen(PORT, async () => {
  await connectToDb();
  await initializeChangeStream();
  logger.info(`Server started on port ${PORT} in ${argv.mode} mode`);

  console.info(
    `\x1b[32m✅ SUCCESS:\x1b[0m Server running on: \x1b[4;36mhttp://localhost:${PORT}/api-docs\x1b[0m`,
  );
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
});
