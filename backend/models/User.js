import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: validator.isEmail,
                message: "Please Enter a Valid Email"
            },
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 200,
            select: false,
        },
        role: {
            type: String,
            enum: ["developer", "client", "admin"],
            required: true,
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
        profilePicture: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/419/149071.png",
        },
        address: {
            country: {
                type: String,
                trim: true,
                lowercase: true,
            },
            state: {
                type: String,
                trim: true,
                lowercase: true,
            },
            city: {
                type: String,
                trim: true,
                lowercase: true,
            },
            zipCode: {
                type: String,
                trim: true,
                validate: {
                    validator: (v) => validator.isPostalCode(v, 'any'),
                    message: 'Invalid Zip Code',
                },
            },
        },
    },
    {
        timestamps: true,
    }
);

//We should HASH the passoword before saving it in the database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//In order to compare whether the password entered by the user matches or not [is same or different]
//It stops us from rehashing the password if it is already hashed

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;