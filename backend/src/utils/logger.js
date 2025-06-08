import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('envFilePath', {
    alias: 'e',
    describe: 'Path to the .env file',
    type: 'string',
    demandOption: true,
  })
  .parse();

dotenv.config({ path: argv.envFilePath });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get log paths from environment variables or use defaults
const LOG_DIR = process.env.LOG_DIR || path.join(__dirname, '../logs');
const APP_LOG_PATH = process.env.APP_LOG_PATH || path.join(LOG_DIR, 'app.log');
const ERROR_LOG_PATH = process.env.ERROR_LOG_PATH || path.join(LOG_DIR, 'error.log');

const getApiType = (path) => {
  if (!path) return 'UNKNOWN';
  
  const apiMatches = {
    '/api/health': 'HEALTH',
    '/api/onboarding': 'ONBOARDING',
    '/api/users': 'USER',
    '/api/auth': 'AUTH',
    '/api/companies': 'COMPANY',
    '/api/chat-box': 'CHAT',
  };

  for (const [prefix, type] of Object.entries(apiMatches)) {
    if (path.startsWith(prefix)) return type;
  }
  
  return 'OTHER';
};

const formatDate = (timestamp) => {
  try {
    // If timestamp is already an ISO string, return it
    if (typeof timestamp === 'string' && timestamp.includes('T')) {
      return timestamp;
    }
    
    // Handle numeric timestamps
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return new Date().toISOString(); // Fallback to current time if invalid
    }
    return date.toISOString();
  } catch (error) {
    return new Date().toISOString(); // Fallback to current time if any error
  }
};

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.metadata(),
  winston.format.printf(({ timestamp, level, message, metadata, stack }) => {
    let log = `[${formatDate(timestamp)}]`;
    
    // Add metadata if exists
    if (metadata && Object.keys(metadata).length > 0) {
      const { requestId, userId, ip, method, path: reqPath, ...rest } = metadata;
      const apiType = getApiType(reqPath);
      
      // log += ` [${level.toUpperCase()}] [${apiType}]`;
      if (requestId) log += ` [ReqID: ${requestId}]`;
      if (userId) log += ` [UserID: ${userId}]`;
      if (ip) log += ` [IP: ${ip}]`;
      if (method && reqPath) log += ` [${method} ${reqPath}]`;
      
      // Add any remaining metadata
      if (Object.keys(rest).length > 0) {
        log += ` ${JSON.stringify(rest)}`;
      }
    } else {
      log += ` [${level.toUpperCase()}]`;
    }
    
    log += `: ${message}`;
    
    // Add stack trace for errors
    if (stack) {
      log += `\n${stack}`;
    }
    
    return log;
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // File transport for all logs
    new winston.transports.File({
      filename: APP_LOG_PATH,
      maxsize: process.env.LOG_MAX_SIZE || 5242880, // 5MB default
      maxFiles: process.env.LOG_MAX_FILES || 5,
    }),
    // Separate file for error logs
    new winston.transports.File({
      filename: ERROR_LOG_PATH,
      level: 'error',
      maxsize: process.env.LOG_MAX_SIZE || 5242880,
      maxFiles: process.env.LOG_MAX_FILES || 5,
    })
  ],
});

// Add console transport in non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    })
  );
}

// Helper functions to add context to logs
logger.withRequestContext = (req) => {
  return {
    info: (message, meta = {}) => {
      const baseMetadata = {
        requestId: req.id,
        userId: req.user?.id,
        ip: req.ip,
        method: req.method,
        path: req.path,
        userEmail: req.user?.email, 
        ...meta
      };

      // Enhance common log messages
      let enhancedMessage = message;
      if (message === 'Incoming request') {
        enhancedMessage = `Incoming ${req.method} request to ${req.path}${req.user ? ` from user ${req.user.email || req.user.id}` : ''}`;
      } else if (message === 'Request completed') {
        enhancedMessage = `Completed ${req.method} request to ${req.path}${req.user ? ` for user ${req.user.email || req.user.id}` : ''}`;
      }

      logger.info(enhancedMessage, {
        metadata: baseMetadata
      });
    },
    error: (message, error, meta = {}) => {
      logger.error(message, {
        metadata: {
          requestId: req.id,
          userId: req.user?.id,
          userEmail: req.user?.email,
          ip: req.ip,
          method: req.method,
          path: req.path,
          ...meta
        },
        stack: error?.stack
      });
    },
    warn: (message, meta = {}) => {
      logger.warn(message, {
        metadata: {
          requestId: req.id,
          userId: req.user?.id,
          userEmail: req.user?.email,
          ip: req.ip,
          method: req.method,
          path: req.path,
          ...meta
        }
      });
    },
    debug: (message, meta = {}) => {
      logger.debug(message, {
        metadata: {
          requestId: req.id,
          userId: req.user?.id,
          userEmail: req.user?.email,
          ip: req.ip,
          method: req.method,
          path: req.path,
          ...meta
        }
      });
    }
  };
};

export default logger;
