import express from 'express';
import {login, signup, logout, updateProfile, checkAuth} from '../controllers/auth.controller.js';    // Importing the functions from the controller
import {protectRoute} from '../middleware/auth.middleware.js';    // Importing the protectRoute middleware

const router = express.Router();

router.post("/signup", signup);    // Route for signing up
router.post("/login", login);      // Route for logging in
router.post("/logout", logout);     // Route for logging out

router.put("/update-profile", protectRoute, updateProfile); // Route for updating profile

router.get("/check", protectRoute, checkAuth); // Route for checking if user is authenticated

export default router;