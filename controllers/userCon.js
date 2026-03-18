const User = require("../models/UserSchema")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    })
}

const signUpUser = async (req, res) => {
    // console.log(req.body, "signup body")
    try {
        const { user_name, name, email, password, user_type } = req.body
        const finalUserName = user_name || name
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
    // console.log(req.body, "signin body")
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
    console.log(req.query.search, "Search value")
    console.log(req.query.page)
    console.log(req.query.filter)
    console.log("working")
    try {
        const limit = 5;
        const page = parseInt(req.query.page) || 1
        const search = req.query.search || ""
        const dateFilter = req.query.filter || ""

        const searchFilter = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },  // case-insensitive search
                    { email: { $regex: search, $options: "i" } }
                ]
            }
            : {};

        if (dateFilter) {
            const now = new Date();
            let startDate = new Date();

            if (dateFilter === "today") {
                startDate.setHours(0, 0, 0, 0);
            } else if (dateFilter === "last week") {
                startDate.setDate(startDate.getDate() - 7);
                startDate.setHours(0, 0, 0, 0);
            } else if (dateFilter === "last month") {
                startDate.setMonth(startDate.getMonth() - 1);
                startDate.setHours(0, 0, 0, 0);
            }

            if (dateFilter === "today" || dateFilter === "last week" || dateFilter === "last month") {
                searchFilter.createdAt = {
                    $gte: startDate,
                    $lte: now
                };
            }
        }

        const totalUsers = await User.countDocuments(searchFilter)
        const totalPages = Math.ceil(totalUsers / limit);

        if (page > totalPages && totalUsers > 0) {
            return res.status(400).json({
                message: `Invalid page number. Total available pages are only ${totalPages}`
            });
        }

        const skipDocuments = (page - 1) * limit;

        const users = await User.find(searchFilter)
            .skip(skipDocuments)
            .limit(limit);

        console.log(users, "backend response user")

        if (users.length === 0) {
            let notFoundMessage = "No user found";
            if (dateFilter === "today") notFoundMessage = "No users found for today";
            else if (dateFilter === "last week") notFoundMessage = "No users found in the last week";
            else if (dateFilter === "last month") notFoundMessage = "No users found in the last month";

            return res.status(200).json({
                message: notFoundMessage,
                totalUsers: 0,
                totalPages: 0,
                currentPage: page,
                users: []
            });
        }

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

const deleteUser = async (req, res) => {
    // console.log(req.params.id, "delete id")
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({
            message: "User deleted successfully"
        })
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


const changePassword = async (req, res) => {
    try {
        const { old_password, new_password } = req.body;

        // Fetch user from DB to get the hashed password (since req.user might have it excluded)
        const user = await User.findById(req.user.id || req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2️⃣ Verify old password
        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid old password"
            });
        }



        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);


        const updatedUser = await User.findOneAndUpdate(
            { _id: req.user.id },
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const myDetails = async (req, res) => {
    console.log(req.user.id, "user")
    try {
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        res.status(200).json({
            message: "User details fetched successfully",
            user
        })
    } catch (error) {
        console.error("My Details Error:", error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

module.exports = {
    signUpUser,
    signInUser,
    allUsers,
    deleteUser,
    changePassword,
    myDetails
}

