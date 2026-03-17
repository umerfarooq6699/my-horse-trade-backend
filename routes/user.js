const express = require("express")
const router = express.Router()
const userController = require("../controllers/userCon")
const { protect } = require("../middleware/authMiddleware")
const multer = require("multer")
const upload = multer()

router.post("/signup", upload.none(), userController.signUpUser)
router.post("/signin", upload.none(), userController.signInUser)
router.get("/all-users", protect, userController.allUsers)

module.exports = router
