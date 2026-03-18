const mongoose = require("mongoose")

const ListingStep2Schema = new mongoose.Schema({

    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ListingStep1",
        required: true,
        unique: true
    },

    // Media
    images: { type: [String], default: [] },
    videos: { type: [String], default: [] },
    documents: { type: [String], default: [] }

}, { timestamps: true })

module.exports = mongoose.model("ListingStep2", ListingStep2Schema)
