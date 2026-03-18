const mongoose = require("mongoose")

const ListingStep3Schema = new mongoose.Schema({

    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ListingStep1",
        required: true,
        unique: true
    },

    // Description
    description: { type: String },
    quick_topics: { type: [String], default: [] }

}, { timestamps: true })

module.exports = mongoose.model("ListingStep3", ListingStep3Schema)
