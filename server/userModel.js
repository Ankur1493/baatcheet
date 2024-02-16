import mongoose from "mongoose";


const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  friends: [{
    type: mongoose.Schema.ObjectId,
  }]
});

// Create the user model
export const User = mongoose.model("User", userSchema);

