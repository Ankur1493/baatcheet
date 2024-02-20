import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from "dotenv"
import bodyParser from "body-parser";
import { Webhook } from 'svix';
import { User } from './userModel.js';
import cors from "cors"
const app = express();
dotenv.config();
app.use(cors())
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
  socket.on("message", (data) => {
    const { message, roomId } = data;
    io.to(roomId).emit('message', message);
  })
  socket.on("joinRoom", roomId => {
    socket.join(roomId);
    console.log(`Room have been joined between these ${roomId}`)
  })
  socket.on("leaveRoom", roomId => {
    socket.leave(roomId);
    console.log(`Room have been leaved ${roomId}`)
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const webhookRawParser = bodyParser.raw({ type: 'application/json' });

app.post(
  "/api/webhooks",
  webhookRawParser,
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
        const { username } = evt.data;
        let user = await User.findOne({ userName: username });
        if (!user) {
          user = new User({ userName: username });
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


app.use(express.json());


app.post("/api/friend-request", async (req, res) => {
  const { sender, receiver } = req.body;
  try {
    const receiverUser = await User.findOne({ userName: receiver });
    const senderUser = await User.findOne({ userName: sender });

    if (!receiverUser || !senderUser) {
      return res.status(404).json({ message: "No user with this username" });
    }

    const receiverId = receiverUser._id;
    const senderId = senderUser._id;

    await User.findByIdAndUpdate(senderId, { $addToSet: { friends: receiverId } });
    await User.findByIdAndUpdate(receiverId, { $addToSet: { friends: senderId } });

    return res.status(201).json({
      username: receiver,
      _id: receiverId,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});



app.get("/api/friends", async (req, res) => {
  const { userName } = req.query;
  try {
    const activeUser = await User.findOne({ userName: userName });
    if (!activeUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userFriends = await User.aggregate([
      { $match: { _id: { $in: activeUser.friends } } },
      { $project: { _id: 1, userName: 1 } }
    ]);

    if (userFriends.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(userFriends);
  } catch (err) {
    console.error("Error fetching user friends:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log('MongoDB connected');
    httpServer.listen(8000, () => {
      console.log('Server running at http://localhost:3000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

