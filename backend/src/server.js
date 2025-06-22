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
import learningPlanRoutes from './api/learning-plan/learning-plan.js';
import feedRoutes from './api/feed/explore.js';
import feedbackConfigRoutes from './api/feedback/config.js';
import teamManagerScoreRoutes from './api/team-and-manager-scrore/team-and-manager-score.js';
import { connectToDb } from './config/db.js';
import { v4 as uuidv4 } from 'uuid';
import cookieParser from 'cookie-parser';
import './controllers/daily-task/daily-task.js';

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
  dev: [process.env.ALLOWED_HOST || '*'],
  stg: [process.env.ALLOWED_HOST || '*'],
  prod: [process.env.ALLOWED_HOST || '*'],
};

app.use(
  cors({
    origin: function (origin, callback) {
      const mode = argv.mode || 'dev';
      const modeAllowed = allowedOrigins[mode];

      // Allow requests with no origin (like curl, mobile apps)
      if (!origin) return callback(null, true);

      if (modeAllowed.includes('*') || modeAllowed.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400,
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

app.use('/api/personalizeLearning', learningPlanRoutes);
app.use('/api/feedback', feedbackConfigRoutes);
app.use('/api/team-and-manager-score', teamManagerScoreRoutes);

app.use('/api/feed', feedRoutes);

app.listen(PORT, async () => {
  await connectToDb();
  logger.info(`Server started on port ${PORT} in ${argv.mode} mode`);
  // logger.info('Daily learning plan update cron job initialized');

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
