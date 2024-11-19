import mongoose from "mongoose"

const seatSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    seatNumber: {
        type: Number,
        required: [true, "Seat Number is required"]
    },
    salonName: {
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