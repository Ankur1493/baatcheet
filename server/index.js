import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from "dotenv"

const app = express();
dotenv.config();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  connectionStateRecovery: true,
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
});

// Socket.io connections
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on("message", (message) => {
    io.emit('message', message);
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log('MongoDB connected');
    // Start the Express server once MongoDB is connected
    httpServer.listen(3000, () => {
      console.log('Server running at http://localhost:3000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

