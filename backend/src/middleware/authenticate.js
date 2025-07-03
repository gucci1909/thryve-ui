import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import { getDb } from '../config/db.js';
import { ObjectId } from 'mongodb';

const authMiddleware = async (req, res, next) => {
  const db = getDb();
  const userCollection = db.collection('users');
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    logger.warn(`Unauthorized access attempt - ${req.method} ${req.url}`);
    return res.status(401).json({
      message:
        '🛑 Access Denied! You need a valid token to proceed. Please log in and try again. 🔐',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    const userDetails = await userCollection.findOne({
      _id: new ObjectId(req.user.id),
    });

    if (userDetails.status !== 'active') {
      return res.status(401).json({
        message:
          '🛑 Access Denied! You need a valid token to proceed. Please log in and try again. 🔐',
      });
    }
    next();
  } catch (error) {
    logger.error(`Invalid token used - ${req.method} ${req.url}`);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: '⏳ Oops! Your session has expired. Please log in again to continue. 🔄',
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message:
          '🚫 Invalid token detected! Are you trying to hack us? 🕵️‍♂️ Try logging in properly.',
      });
    } else {
      return res.status(401).json({
        message: '🔍 Authentication failed! Something went wrong. Try again or contact support. 🤔',
      });
    }
  }
};

export const authAdminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    logger.warn(`Unauthorized access attempt - ${req.method} ${req.url}`);
    return res.status(401).json({
      message:
        '🛑 Access Denied! You need a valid token to proceed. Please log in and try again. 🔐',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Invalid token used - ${req.method} ${req.url}`);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: '⏳ Oops! Your session has expired. Please log in again to continue. 🔄',
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message:
          '🚫 Invalid token detected! Are you trying to hack us? 🕵️‍♂️ Try logging in properly.',
      });
    } else {
      return res.status(401).json({
        message: '🔍 Authentication failed! Something went wrong. Try again or contact support. 🤔',
      });
    }
  }
};

export const adminCompanyMiddleware = (req, res, next) => {
  if (req.user.role !== 'company-admin' && req.user.role !== 'super-admin') {
    logger.warn(`Unauthorized admin access attempt - ${req.method} ${req.url}`);
    return res.status(403).json({
      message: '🚫 You do not have permission to access this resource. 🔒',
    });
  }
  next();
};

export default authMiddleware;
