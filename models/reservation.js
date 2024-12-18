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
        required: [true, "QR Code is required"],
        default: ""
    },
    outReason: [
        {
            type: {
                type: String,
                enum: ["short", "long"],
                // required: [true, "Type is required"]
            },

            date: {
                type: Date,
                // required: [true, "Date is required"]
            },

            time: {
                type: Number,
                // required: [true, "Time is required"]
            }
        }
    ],
    isCheckIn: {
        type: Boolean,
        default: false
    },
    expireTime: {
        type: Date,
        default: 0
    }

}, { timestamps: true })

export default mongoose.model("Reservation", reservationSchema);