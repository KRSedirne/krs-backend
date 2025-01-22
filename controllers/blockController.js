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
      console.log("Received saloonId:", req.params.id);
  
      const saloonId = req.params.id;
      let targetSaloon = null;
      const blocks = await Block.find();

    for (let block of blocks) {
        console.log("Checking block:", block);
        for(let saloon of block.saloon){
            console.log("Checking saloon:", saloon);
            if (saloon.id === saloonId.toString()) {
                targetSaloon = saloon;
                break;
            }
        }
    }
      
      console.log("Target saloon:", targetSaloon);
  
      if (!targetSaloon) {
        return res.status(404).json({ message: "Saloon not found in this block" });
      }
  
      if (!targetSaloon.image) {
        return res.status(404).json({ message: "No image found for this saloon" });
      }

      let imagePath = targetSaloon.image.url;

      if (imagePath.startsWith("http")) {
        return res.status(200).json({ url: imagePath, width: targetSaloon.image.width, height: targetSaloon.image.height });
      }
  
      return res.status(404).json({ message: "Invalid image URL" });

    } catch (error) {
      console.error("Error while retrieving saloon image:", error);
      return next(new ErrorHandler("Cannot retrieve saloon image", 500));
    }
  });

