const User = require("../models/UserSchema")

const signUpUser = async (req, res) => {
    try {
        const { user_name, email, password } = req.body

        // Simple validation
        if (!user_name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" })
        }

        const newUser = await User.create({
            user_name,
            email,
            password
        })

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                user_name: newUser.user_name,
                email: newUser.email
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

        // Check password (Note: currently plain text)
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        res.status(200).json({
            message: "Login successful",
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

