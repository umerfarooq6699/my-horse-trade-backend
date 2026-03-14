const ListingSchema = require("../models/LIstingSchema");

// STEP 1: Initial Creation
exports.createListing = async (req, res) => {
    try {
        const listing = await ListingSchema.create({
            ...req.body,
            form_step: 1
        });
        res.status(201).json({
            success: true,
            message: "Listing initialized (Step 1 complete)",
            data: listing
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// STEP 2: Media Update
exports.updateStep2 = async (req, res) => {
    try {
        const { images, videos, documents } = req.body;
        const listing = await ListingSchema.findByIdAndUpdate(
            req.params.id,
            { images, videos, documents, form_step: 2 },
            { new: true, runValidators: true }
        );
        if (!listing) return res.status(404).json({ success: false, message: "Listing not found" });

        res.status(200).json({
            success: true,
            message: "Media updated (Step 2 complete)",
            data: listing
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// STEP 3: Description Update
exports.updateStep3 = async (req, res) => {
    try {
        const { description, quick_topics } = req.body;
        const listing = await ListingSchema.findByIdAndUpdate(
            req.params.id,
            { description, quick_topics, form_step: 3 },
            { new: true, runValidators: true }
        );
        if (!listing) return res.status(404).json({ success: false, message: "Listing not found" });

        res.status(200).json({
            success: true,
            message: "Description updated (Step 3 complete)",
            data: listing
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// STEP 4: Finalize Listing
exports.updateStep4 = async (req, res) => {
    try {
        const { listing_headline, promotional_tags, inclusion_terms, special_conditions } = req.body;
        const listing = await ListingSchema.findByIdAndUpdate(
            req.params.id,
            {
                listing_headline,
                promotional_tags,
                inclusion_terms,
                special_conditions,
                form_step: 4,
                status: "active"
            },
            { new: true, runValidators: true }
        );
        if (!listing) return res.status(404).json({ success: false, message: "Listing not found" });

        res.status(200).json({
            success: true,
            message: "Listing finalized (Step 4 complete)",
            data: listing
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};