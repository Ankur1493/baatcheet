import mongoose from "mongoose";

// Define the friend schema
const friendSchema = mongoose.Schema({
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the userModel
    required: true,
  },
});

export const Friend = mongoose.model("Friend", friendSchema)


