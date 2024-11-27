import mongoose from "mongoose"

const seatSchema = new mongoose.Schema({
    seatNumber: {
        type: Number,
        required: [true, "Seat Number is required"]
    },
    saloonName: {
        type: String,
        required: [true, "Salon Name is required"]
    },
    blockName: {
        type: String,
        required: [true, "Block Name is required"]
    },
    isBooked: {
        type: Boolean,
        default: false
    }
})

export default mongoose.model("Seat", seatSchema);