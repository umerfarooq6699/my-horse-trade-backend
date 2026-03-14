require("dotenv").config()
const express = require("express")
const app = express()
const connectDB = require("./config/db")
const listingRoutes = require("./routes/listing")
const userRoutes = require("./routes/user")


// Middleware
app.use(express.json())

connectDB()
const PORT = process.env.PORT || 8000


app.get("/", (req, res) => {
    res.send("hello world")
})

// Routes
app.use(listingRoutes)
app.use(userRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})