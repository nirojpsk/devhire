import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
        trim: true
    },
    description: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 2000,
        trim: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    },
    budget: {
      min: {
        type: Number,
        required: true,
        min: 50
      },
      max: {
        type: Number,
        required: true
      }
    },
    skillsRequired: {
        type: [String],
        required: true
    },
    deadline: {
        type: Date,
        required: true

    },
    status: {
        type: String,
        enum: [
            "open",
            "in-progress",
            "completed",
            "cancelled"
        ],
        default: "open"
    },
    selectedDeveloper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    },
    submission: {
        link: {
            type: String,
            trim: true,
        },
        note: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
        submittedAt: {
            type: Date,
        },
        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        clientDecision: {
            status: {
                type: String,
                enum: ["pending", "accepted", "rejected"],
                default: "pending",
            },
            note: {
                type: String,
                trim: true,
                maxlength: 1000,
            },
            decidedAt: {
                type: Date,
            },
            decidedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        },
        clientReview: {
            rating: {
                type: Number,
                min: 1,
                max: 5,
            },
            comment: {
                type: String,
                trim: true,
                maxlength: 500,
            },
            reviewedAt: {
                type: Date,
            },
            reviewedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        },
    },
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
export default Project; 
