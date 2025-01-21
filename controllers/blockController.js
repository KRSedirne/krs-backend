import Block from "../models/block.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

// Admin get all blocks
export const getAllBlocks = catchAsyncErrors(async (req, res, next) => {
    try {
        const blocks = await Block.find();

        if (blocks.length === 0) {
            return next(new ErrorHandler("Blocks not found", 404));
        }

        return res.status(200).json({ blocks });
    } catch (error) {
        return next(new ErrorHandler("Blocks not found, something is gone wrong...", 404));
    }
});

// Admin get a block
export const getBlockDetails = catchAsyncErrors(async (req, res, next) => {
    try {
        const block = await Block.findById(req?.params?.id);

        if (!block) {
            return next(new ErrorHandler("Block not found with this ID", 404));
        }
        return res.status(200).json({ block });
    } catch (error) {
        return next(new ErrorHandler("Block not found with this ID", 404));
    }
});


