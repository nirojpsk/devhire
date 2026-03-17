import mongoose from "mongoose";
import validator from "validator";
const clientSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    companyName: {
        type: String,
        trim: true,
        required: true,
        minlength: 10,
        maxlength: 100
    },
    bio: {
        type: String,
        trim: true,
        required: true,
        minlength: 10,
        maxlength: 1000
    },
    website: {
        type: String,
        trim: true,
        validate: {
            validator: (v) => !v || validator.isURL(v, {
                protocols: ["http", "https"],
                require_protocol: true
            }),
            message: "Please Provide a Valid Website URL",
        },
    },
    totalProjectsPosted: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

//to prevent a user from having multiple client profiles

clientSchema.index({ userId: 1 }, { unique: true });

const Client = mongoose.model("Client", clientSchema);
export default Client;