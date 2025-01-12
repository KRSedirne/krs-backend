import mongoose from "mongoose"

const seatSchema = new mongoose.Schema({
    seatNumber: {
        type: Number,
        required: [true, "Seat Number is required"]
    },
    saloonName: {
        type: String,
        required: [true, "Saloon is required"]
    },
    block: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blocks",
        required: [true, "Block is required"]
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    position: {
        r: Number,
        x: Number,
        y: Number
      }
})

export default mongoose.model("Seat", seatSchema);