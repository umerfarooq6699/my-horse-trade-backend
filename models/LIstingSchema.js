const mongoose = require("mongoose")

const ListingSchema = new mongoose.Schema({

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // STEP 1
    name: { type: String, required: true },
    breed: { type: String, required: true },
    gender: {
        type: String,
        enum: ["stallion", "mare", "gelding"],
        required: true
    },
    age: { type: Number, required: true },
    height: { type: Number, required: true },
    color: { type: String, required: true },
    mark: { type: String },
    temperament: { type: [String], default: [] },

    sale: {
        type: {
            type: String,
            enum: ["fixed", "auction"],
            required: true
        },
        price: Number,
        auction: {
            starting_bid: Number,
            reserve_price: Number,
            duration: Number,
            buy_now_price: Number,
            start_time: Date,
            end_time: Date
        }
    },

    // STEP 2 (media)
    images: [String],
    videos: [String],
    documents: [String],

    // STEP 3
    description: String,
    quick_topics: [String],

    // STEP 4
    listing_headline: String,
    promotional_tags: [String],
    inclusion_terms: [String],
    special_conditions: String,

    // track form progress
    form_step: {
        type: Number,
        default: 1
    },

    status: {
        type: String,
        enum: ["draft", "active", "sold", "expired"],
        default: "draft"
    }

}, { timestamps: true })

module.exports = mongoose.model("Listing", ListingSchema)