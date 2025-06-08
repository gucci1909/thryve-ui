import { getDb } from '../../config/db.js';
import { ObjectId } from 'mongodb';

const clients = new Map();

export const sseController = async (req, res) => {
  const userId = req.user.id;

  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Send initial connection message
  res.write('data: {"type": "connected"}\n\n');

  // Store client connection
  if (!clients.has(userId)) {
    clients.set(userId, new Set());
  }
  clients.get(userId).add(res);

  // Handle client disconnection
  req.on('close', () => {
    clients.get(userId)?.delete(res);
    if (clients.get(userId)?.size === 0) {
      clients.delete(userId);
    }
  });
};

export const notifyClients = async (userId, message) => {
  const userClients = clients.get(userId);
  if (userClients) {
    const messageString = JSON.stringify({
      type: 'message',
      data: message
    });
    userClients.forEach(client => {
      client.write(`data: ${messageString}\n\n`);
    });
  }
};

// Watch for database changes
export const initializeChangeStream = async () => {
  const db = getDb();
  const collection = db.collection('chats');
  
  const changeStream = collection.watch([
    {
      $match: {
        operationType: { $in: ['insert', 'update'] }
      }
    }
  ]);

  changeStream.on('change', async (change) => {
    if (change.operationType === 'update') {
      const userId = change.documentKey._id.toString();
      const chat = await collection.findOne({ _id: new ObjectId(userId) });
      
      if (chat && chat.chat_context.length > 0) {
        const latestMessage = chat.chat_context[chat.chat_context.length - 1];
        await notifyClients(userId, latestMessage);
      }
    }
  });

  changeStream.on('error', (error) => {
    console.error('Change stream error:', error);
    // Attempt to restart the change stream after a delay
    setTimeout(initializeChangeStream, 5000);
  });
}; 

export const setupPointsSSEConnection = async (req, res) => {
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
};