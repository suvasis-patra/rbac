import { model, Document, Schema, ObjectId } from "mongoose";

import { hashPassword } from "../utils";

interface IUser extends Document {
  _id: ObjectId;
  fullName: string;
  email: string;
  password: string;
  role: "User" | "Moderator" | "Admin";
  refreshToken?: string;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      min: [8, "Password is too short"],
    },
    role: {
      type: String,
      enum: ["User", "Moderator", "Admin"],
      default: "User",
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await hashPassword(this.password);
  next();
});

export const User = model<IUser>("User", userSchema);
