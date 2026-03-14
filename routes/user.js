const express = require("express")
const router = express.Router()
const userController = require("../controllers/userCon")
const multer = require("multer")
const upload = multer()

router.post("/signup", upload.none(), userController.signUpUser)
router.post("/signin", upload.none(), userController.signInUser)

module.exports = router
