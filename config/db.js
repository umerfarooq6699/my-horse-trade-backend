const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://umerfarooq:umer67084**@cluster0.wjtvxng.mongodb.net/my-horse-trade")
        console.log("MongoDB connected")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB
