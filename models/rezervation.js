import mongoose from "mongoose"

const rezervationSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    seat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat",
        required: [true, "Seat is required"]
    },
    rezervationDate: {
        type: Date,
        required: [true, "Rezervation Date is required"]
    },
    qrCode: {
        type: String,
        required: [true, "QR Code is required"]
    },
    outReason: {
        type: String,
        required: [true, "Out Reason is required"],
        default: "false"
    },
    isCheckIn: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export default mongoose.model("Rezervation", rezervationSchema);