import { Router } from "express";
import { deleteUser, getAllUsers, getUserById, updateUser, getActiveUser, uploadProfilePicture } from "./user.controller";
import upload from "../config/multer.config";

const router = Router();

// Get all users
router.get("/", getAllUsers);

//Get active user
router.get("/me", getActiveUser);

// Get user by ID
router.get("/:id", getUserById);

// Update user
router.patch("/:id", updateUser);

//Upload Proflie Picture
router.post("/:id/profile-picture", upload.single("profilePicture"), uploadProfilePicture);

// Delete user
router.delete("/:id", deleteUser);

export default router;
