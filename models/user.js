import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    lastname: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        maxlength: [30, "Password shouldn't be more 30 character"],
        select: false
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
})

export default mongoose.model("User", userSchema);