import mongoose from "mongoose"

const lockerSchema = new mongoose.Schema({
    lockerNumber: {
        type: Number,
        required: [true, "Locker Number is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    isBooked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export default mongoose.model("Locker", lockerSchema);

