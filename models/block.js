import mongoose from "mongoose";

const blockSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    saloon: [
        {
            saloonName: {
                type: String,
                required: [true, "Name is required"]
            },
            image: {
                url: {
                    type: String,
                    required: true,
                },
                public_id: {
                    type: String,
                },
            }
        }
    ]
});

export default mongoose.model("Block", blockSchema);