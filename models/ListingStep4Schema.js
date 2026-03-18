const mongoose = require("mongoose")

const ListingStep4Schema = new mongoose.Schema({

    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ListingStep1",
        required: true,
        unique: true
    },

    // Finalize Info
    listing_headline: { type: String },
    promotional_tags: { type: [String], default: [] },
    inclusion_terms: { type: [String], default: [] },
    special_conditions: { type: String }

}, { timestamps: true })

module.exports = mongoose.model("ListingStep4", ListingStep4Schema)
