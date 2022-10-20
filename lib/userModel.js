import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9_]{2,32}$/,
  },
  id: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  dateLastChanged: {
    type: Date,
    required: true,
  },
  usernameChanges: {
    type: [Object],
    required: true,
  },
  ipAccessed: {
    type: [String],
    required: true,
  },
  isBanned: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.models.User ||
  mongoose.model("User", userSchema, "users");
