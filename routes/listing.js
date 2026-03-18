const express = require("express")
const router = express.Router()
const multer = require("multer")
const upload = multer()
const listingCon = require("../controllers/listingCon")
const { protect } = require("../middleware/authMiddleware")

router.post("/create-step-1", protect, upload.none(), listingCon.createListing)
router.post("/create-step-2/:id", protect, upload.none(), listingCon.updateStep2)
router.post("/create-step-3/:id", protect, upload.none(), listingCon.updateStep3)
router.post("/create-step-4/:id", protect, upload.none(), listingCon.updateStep4)

module.exports = router