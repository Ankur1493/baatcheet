import mongoose from "mongoose";
import { friendSchema } from "./friendModel.js";

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  friends: [friendSchema], // Embed the friend schema as an array in the user schema
});

// Create the user model
const userModel = mongoose.model("User", userSchema);

export { userModel };
