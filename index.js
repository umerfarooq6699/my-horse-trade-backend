require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express()
const connectDB = require("./config/db")
const listingRoutes = require("./routes/listing")
const userRoutes = require("./routes/user")

// Middleware
app.use(cors())
app.use(express.json())

connectDB()
const PORT = process.env.PORT || 8000


app.get("/", (req, res) => {
    res.send("hello world")
})

app.get("/ping", (req, res) => {
    res.send("pong")
})

// Routes
app.use(listingRoutes)
app.use(userRoutes)


if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

module.exports = app
