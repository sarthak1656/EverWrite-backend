import mongoose, { Schema } from "mongoose";
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /\S+@\S+\.\S+/,
    },
    password:{
        type: String,
        required: true,
    },
    createdOn:{
        type: Date,
        default: new Date().getTime()
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
