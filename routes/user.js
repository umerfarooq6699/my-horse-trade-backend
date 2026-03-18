const express = require("express")
const router = express.Router()
const userController = require("../controllers/userCon")
const { protect } = require("../middleware/authMiddleware")
const multer = require("multer")
const upload = multer()

router.post("/signup", upload.none(), userController.signUpUser)
router.post("/signin", upload.none(), userController.signInUser)
router.get("/all-users", protect, userController.allUsers)
router.delete("/delete-user/:id", protect, userController.deleteUser)
router.patch("/change-password", protect, upload.none(), userController.changePassword)
router.get("/my-details", protect, userController.myDetails)

module.exports = router
