const User = require("../models/UserSchema")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    })
}

const signUpUser = async (req, res) => {
    console.log(req.body, "signup body")
    try {
        const { user_name, name, email, password, user_type } = req.body
        const finalUserName = user_name || name

        // // Simple validation
        // if (!finalUserName || !email || !password) {
        //     return res.status(400).json({ message: "All fields are required" })
        // }

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" })
        }

        const newUser = await User.create({
            user_name: finalUserName,
            email,
            password,
            user_type: user_type || "USER"
        })

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                user_name: newUser.user_name,
                email: newUser.email,
                user_type: newUser.user_type
            }
        })
    } catch (error) {
        console.error("Signup Error:", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const signInUser = async (req, res) => {
    try {
        const { email, password } = req.body

        // Validations
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        // Email format validation (basic regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" })
        }

        // Check if user exists
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Check password (using bcrypt comparison)
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        res.status(200).json({
            message: "Login successful",
            token: generateToken(user._id),
            user: {
                id: user._id,
                user_name: user.user_name,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Signin Error:", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const allUsers = async (req, res) => {
    try {
        const limit = 5;
        const page = parseInt(req.query.page) || 1
        const totalUsers = await User.countDocuments()
        const totalPages = Math.ceil(totalUsers / limit);

        if (page > totalPages && totalUsers > 0) {
            return res.status(400).json({
                message: `Invalid page number. Total available pages are only ${totalPages}`
            });
        }

        const skipDocuments = (page - 1) * limit;

        const users = await User.find()
            .skip(skipDocuments)
            .limit(limit);

        res.status(200).json({
            message: "Users fetched successfully",
            totalUsers: totalUsers,
            totalPages: totalPages,
            currentPage: page,
            users,
        });
    } catch (error) {
        console.error("All Users Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    signUpUser,
    signInUser,
    allUsers
}

