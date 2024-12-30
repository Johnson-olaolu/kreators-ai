import mongoose, { Schema, Document } from "mongoose";

export interface IDevice extends Document {
  token: string;
  email: string;
  deviceId: string;
  deviceName: string;
}

const deviceSchema = new Schema<IDevice>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    token: {
      type: String,
      required: true,
    },
    deviceId: {
      unique: true,
      type: String,
      required: true,
    },
    deviceName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Device = mongoose.model<IDevice>("Device", deviceSchema);
