import mongoose from "mongoose"

const saloonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    img: {
        type: String,
        required: [true, "Image is required"]
    },
})

export default mongoose.model("Saloon", saloonSchema);