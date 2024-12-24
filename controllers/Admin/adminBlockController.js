import Block from "../../models/blocks";
import ErrorHandler from "../../utils/errorHandler";
import catchAsyncErrors from "../../middlewares/catchAsyncErrors";

// Admin get all blocks
export const adminGetAllBlocks = catchAsyncErrors(async (req, res, next) => {
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
export const adminGetBlockDetails = catchAsyncErrors(async (req, res, next) => {
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

// Admin create a block
export const adminCreateBlock = catchAsyncErrors(async (req, res, next) => {
    try {
        const isBlockExist = await Block.findOne({ name: req?.body?.name });

        if (isBlockExist) {
            return next(new ErrorHandler("Block already exist", 409));
        }

        const block = await Block.create(req?.body);
        return res.status(201).json({ block });
    } catch (error) {
        return next(new ErrorHandler("Block couldn't create, something is gone wrong...", 500));
    }
});

// Admin update a block
export const adminUpdateBlock = catchAsyncErrors(async (req, res, next) => {
    try {
        const block = await Block.findByIdAndUpdate(req?.params?.id, req?.body, { new: true });

        if (!block) {
            return next(new ErrorHandler("Block not found with this ID", 404));
        }

        return res.status(200).json({ block });
    } catch (error) {
        return next(new ErrorHandler("Block couldn't update, something is gone wrong...", 500));
    }
});

// Admin delete a block
export const adminDeleteBlock = catchAsyncErrors(async (req, res, next) => {
    try {
        const block = await Block.findById(req?.params?.id);

        if (!block) {
            return next(new ErrorHandler("Block not found with this ID", 404));
        }

        await block.deleteOne();

        return res.status(204).json({ message: "Block deleted successfully" });
    } catch (error) {
        return next(new ErrorHandler("Block couldn't delete, something is gone wrong...", 500));
    }
});
