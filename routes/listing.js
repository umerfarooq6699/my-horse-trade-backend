const express = require("express")
const router = express.Router()
const listingCon = require("../controllers/listingCon")

router.post("/create", listingCon.createListing)
router.put("/update-step-2/:id", listingCon.updateStep2)
router.put("/update-step-3/:id", listingCon.updateStep3)
router.put("/update-step-4/:id", listingCon.updateStep4)

module.exports = router