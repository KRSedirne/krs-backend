import mongoose from "mongoose"

const lockerSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    lockerNumber: {
        type: Number,
        required: [true, "Locker Number is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    isBooked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export default mongoose.model("Locker", lockerSchema);