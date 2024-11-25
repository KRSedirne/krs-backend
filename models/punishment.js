import mongoose from "mongoose"

const punishmentSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User is required"]
    },
    type: {
        type: String,
        required: [true, "Type is required"]
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

export default mongoose.model("Punishement", punishmentSchema);