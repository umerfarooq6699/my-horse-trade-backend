const mongoose = require("mongoose")

const ListingStep1Schema = new mongoose.Schema({

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Basic Horse Info
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

    // Sale Info
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

    // Form progress tracker
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

module.exports = mongoose.model("ListingStep1", ListingStep1Schema)
