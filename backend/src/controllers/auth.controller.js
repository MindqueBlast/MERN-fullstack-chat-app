import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    console.log('Request body:', req.body); // Log the request body
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            generateToken(newUser._id, res); // Set the token in the cookies
            await newUser.save(); // Save the new user to the database

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

            console.log('User created successfully!'); // Log success message
        }
    } catch (error) {
        console.error('Error in signup:', error); // Log any errors
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        await bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                generateToken(user._id, res);

                res.status(200).json({
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    profilePic: user.profilePic,
                });
            } else {
                return res.status(400).json({ message: "Invalid Credentials" });
            }
        });
    } catch (error) {
        console.error('Error in login:', error); // Log any errors
        res.status(500).json({ message: "Server error" });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie('jwt');
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {    
        console.error('Error in logout:', error); // Log any errors
        res.status(500).json({ message: "Server error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullName, email, profilePic } = req.body;
        const userID = req.user._id;

        const user = await User.findById(userID);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userID,
            {
                fullName: fullName || user.fullName,
                email: email || user.email,
                profilePic: uploadResponse.secure_url || user.profilePic,
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            profilePic: updatedUser.profilePic,
        });

    } catch (error) {
        console.error('Error in updateProfile:', error); // Log any errors
        res.status(500).json({ message: "Server error" });
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};