import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    developerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    bidAmount: {
        type: Number,
        required: true,
        min: 50
    },
    proposal: {
        type: String,
        required: true,
        trim: true,
        minlength: 50,
        maxlength: 5000,
    },
    deliveryTime: {
        type: Number,
        required: true,
        min: 1
    },
    editCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },

}, { timestamps: true });

//Developer lai same project ma multliple bidding garnu na denu lai

bidSchema.index({ projectId: 1, developerId: 1 }, { unique: true });

const Bid = mongoose.model("Bid", bidSchema);
export default Bid;