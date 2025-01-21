import mongoose from "mongoose"

const suspendedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User is required"]
    },
    type: {
        type: String,
        enum: ["locker", "reservation"],
        required: [true, "Type is required"] // enum
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    expireTime: {
        type: Date,
        required: [true, "Expire Date is required"]
    }
})

export default mongoose.model("Suspendeds", suspendedSchema);

