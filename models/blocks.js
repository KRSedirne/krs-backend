import mongoose from "mongoose";

const blockSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    }
});

export default mongoose.model("Block", blockSchema);