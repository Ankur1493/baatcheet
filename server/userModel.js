import mongoose from "mongoose";


const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
});

// Create the user model
export const User = mongoose.model("User", userSchema);

