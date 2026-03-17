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
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
export default Project; 