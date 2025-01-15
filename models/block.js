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

                public_id: {
                    type: String,
                    required: [true, "Image is required"]
                },
                url: {
                    type: String,
                    required: [true, "Image is required"]
                }

            },
        }
    ]
});

export default mongoose.model("Block", blockSchema);