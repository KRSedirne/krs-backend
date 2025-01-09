import mongoose from "mongoose";

const blockSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    saloon: [
        {
            name: {
                type: String,
                required: [true, "Name is required"]
            },
            image: {
                type: String,
                required: [true, "Image is required"]
            },
        }
    ]
});

export default mongoose.model("Block", blockSchema);