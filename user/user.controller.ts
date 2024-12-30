import { NextFunction, Request, Response } from "express";
import { IUser, User } from "./models/user.model"; // Assuming you have a User model
import expressAsyncHandler from "express-async-handler";
import { AppError } from "../utils/errorHandler";
import path from "path";
import fs from "fs";

// Get all users
export const getAllUsers = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    throw new AppError("Error fetching users", 500);
  }
});

// Get active user (current logged-in user)
export const getActiveUser = expressAsyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user as IUser;
  if (!user) {
    throw new AppError("Not authenticated", 401);
  }
  res.status(200).json(user);
});

// Get user by ID
export const getUserById = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    res.status(200).json(user);
  } catch (error) {
    throw new AppError("Error fetching user", 500);
  }
});

// Update user
export const updateUser = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    //await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    for (const key in req.body) {
      if (key in user && typeof user[key as keyof IUser] !== "undefined") {
        (user as any)[key] = req.body[key];
      }
    }
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    throw new AppError("Error updating user", 500);
  }
});

// Delete user
export const deleteUser = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      throw new AppError("User not found", 404);
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    throw new AppError("Error deleting user", 500);
  }
});

export const uploadProfilePicture = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const filePath = `/public/profile-images/${(req.file as Express.Multer.File).filename}`;

    // Delete old profile picture if it exists
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.profilePicture) {
      const oldPath = path.resolve("./" + user.profilePicture);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    user.profilePicture = filePath;
    await user.save();

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      user,
    });
  } catch (error) {
    throw new AppError("Error uploading profile picture", 500);
  }
});
