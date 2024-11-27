import mongoose from "mongoose"

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User is required"]
    },
    seat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "seats",
        required: [true, "Seat is required"]
    },
    reservationDate: {
        type: Date,
        required: [true, "Reservation Date is required"]
    },
    qrCode: {
        type: String,
        required: [true, "QR Code is required"]
    },
    outReason: [
        {
            description: {
                type: String,
                required: [true, "Description is required"]
            },
            date: {
                type: Date,
                required: [true, "Date is required"]
            }
        }
    ],
    isCheckIn: {
        type: Boolean,
        default: false
    }


}, { timestamps: true })

export default mongoose.model("Reservation", reservationSchema);