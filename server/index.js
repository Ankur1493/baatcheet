import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from "dotenv"
import bodyParser from "body-parser";
import { Webhook } from 'svix';
import { User } from './userModel.js';

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

app.post(
  "/api/webhooks",
  bodyParser.raw({ type: "application/json" }),
  async function(req, res) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error("You need a WEBHOOK_SECRET in your .env");
    }

    // Grab the headers and body
    const headers = req.headers;
    const payload = req.body;

    // Get the Svix headers for verification
    const svix_id = headers["svix-id"];
    const svix_timestamp = headers["svix-timestamp"];
    const svix_signature = headers["svix-signature"];

    // If there are missing Svix headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).send("Error occurred -- no svix headers");
    }

    // Initiate Svix
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;

    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });

      if (evt.type === "user.created") {
        const { username } = evt.data; // Access username directly from evt.data

        let user = await User.findOne({ userName: username }); // Use username variable here
        if (!user) {
          user = new User({ userName: username }); // Use username variable here as well
          await user.save();
        }
      }


    } catch (err) {
      // Console log and return error
      console.log("Webhook failed to verify. Error:, Bolo tarrarararara", err.message);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Webhook received",
    });
  }
);
// MongoDB connection
mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log('MongoDB connected');
    // Start the Express server once MongoDB is connected
    httpServer.listen(8000, () => {
      console.log('Server running at http://localhost:3000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

