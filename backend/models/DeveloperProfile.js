import mongoose from "mongoose";
import validator from "validator";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const developerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    bio: {
        type: String,
        required: true,
        trim: true,
        minlength: 20,
        maxlength: 200,
    },
    skills: {
        type: [String],
        required: true,
    },
    experienceYears: {
        type: Number,
        min: 0,
        max: 50,
        default: 0
    },
    availability: {
        type: String,
        enum: ["available", "busy"],
        default: "available"
    },
    links: {
        portfolio: {
            type: String,
            trim: true,
            validate: {
                validator: (v) => !v || validator.isURL(v, {
                    protocols: ['http', 'https'],
                    require_protocol: true
                }),
                message: "Please provide a valid Portfolio URL"
            },
        },
        github: {
            type: String,
            trim: true,
            validate: {
                validator: (v) => !v || validator.isURL(v, {
                    protocols: ['http', 'https'],
                    require_protocol: true
                }),
                message: "Please provide a valid GitHub URL"
            },
        },
        linkedin: {
            type: String,
            trim: true,
            validate: {
                validator: (v) => !v || validator.isURL(v, {
                    protocols: ['http', 'https'],
                    require_protocol: true
                }),
                message: "Please provide a valid LinkedIn URL"
            }
        },

    },
    rate: {
        type: Number,
        required: true,
        default: 0,
    },
    reviews: [reviewSchema],
    averageRating: {
        type: Number,
        default: 0,
    },
    totalReviews: {
        type: Number,
        default: 0,
    }
},
    { timestamps: true }
);

//In order to calculate the total ratings and the average ratings of the developer
developerSchema.pre("save", function (next) {
    if (this.reviews.length > 0) {
        this.totalReviews = this.reviews.length;
        this.averageRating =
            Math.round(
                (this.reviews.reduce((acc, review) => acc + review.rating, 0) /
                    this.reviews.length) *
                10
            ) / 10;
    }
    next();
})
const Developer = mongoose.model("Developer", developerSchema);
export default Developer;

