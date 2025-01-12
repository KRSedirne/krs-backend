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

export const getSaloonImages = catchAsyncErrors(async (req, res, next) => {
    try {
        const block = await Block.findById(req.params.id);

        if (!block) {
            return next(new ErrorHandler("Block not found", 404));
        }

        const saloons = block.saloon;

        if (saloons.length === 0) {
            return res.status(404).json({ message: "No saloons found in this block" });
        }

        const saloonImages = saloons
            .filter(saloon => saloon.image)
            .map(saloon => `${req.protocol}://${req.get('host')}/uploads/${saloon.image}`);

        if (saloonImages.length === 0) {
            return res.status(404).json({ message: "No saloon images found in this block" });
        }

        return res.status(200).json({ images: saloonImages });

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Cannot retrieve saloon images", 500));
    }
});
