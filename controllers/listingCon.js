const ListingStep1 = require("../models/ListingStep1Schema");
const ListingStep2 = require("../models/ListingStep2Schema");
const ListingStep3 = require("../models/ListingStep3Schema");
const ListingStep4 = require("../models/ListingStep4Schema");

// STEP 1: Horse Info + Sale Details
exports.createListing = async (req, res) => {
    try {
        const listing = await ListingStep1.create({
            ...req.body,
            seller: req.user._id,
            form_step: 1
        });
        res.status(201).json({
            success: true,
            message: "Listing initialized (Step 1 complete)",
            listingId: listing._id,
            data: listing
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// STEP 2: Media Upload (images, videos, documents)
exports.updateStep2 = async (req, res) => {
    try {
        const { images, videos, documents } = req.body;

        const step2 = await ListingStep2.findOneAndUpdate(
            { listing: req.params.id },
            { listing: req.params.id, images, videos, documents },
            { new: true, upsert: true, runValidators: true }
        );

        // Update form_step tracker on Step1
        await ListingStep1.findByIdAndUpdate(req.params.id, { form_step: 2 });

        res.status(200).json({
            success: true,
            message: "Media uploaded (Step 2 complete)",
            data: step2
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// STEP 3: Description & Quick Topics
exports.updateStep3 = async (req, res) => {
    try {
        const { description, quick_topics } = req.body;

        const step3 = await ListingStep3.findOneAndUpdate(
            { listing: req.params.id },
            { listing: req.params.id, description, quick_topics },
            { new: true, upsert: true, runValidators: true }
        );

        // Update form_step tracker on Step1
        await ListingStep1.findByIdAndUpdate(req.params.id, { form_step: 3 });

        res.status(200).json({
            success: true,
            message: "Description updated (Step 3 complete)",
            data: step3
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// STEP 4: Finalize Listing
exports.updateStep4 = async (req, res) => {
    try {
        const { listing_headline, promotional_tags, inclusion_terms, special_conditions } = req.body;

        const step4 = await ListingStep4.findOneAndUpdate(
            { listing: req.params.id },
            { listing: req.params.id, listing_headline, promotional_tags, inclusion_terms, special_conditions },
            { new: true, upsert: true, runValidators: true }
        );

        // Mark listing as active and form complete
        await ListingStep1.findByIdAndUpdate(req.params.id, { form_step: 4, status: "active" });

        res.status(200).json({
            success: true,
            message: "Listing finalized (Step 4 complete)",
            data: step4
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};