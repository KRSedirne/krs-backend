import Block from "../../models/block.js";
import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middlewares/catchAsyncErrors.js";
import { sendImageToPython} from "../../utils/imageAnalizer.js";
import cloudinary from "../../configs/cloudinaryConfig.js";

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

export const adminAddSaloon = catchAsyncErrors(async (req, res, next) => {
    try {
        // Body'den gelen verileri al ve kontrol et
        const { saloonName, url: base64Image,width,height } = req.body;
        const blockId = req.params.id;

        if (!saloonName || !base64Image|| !width || !height) {
            return next(new ErrorHandler("Saloon name, image, width, and height are required", 400));
        }

        console.log("Saloon Name:", saloonName);
        console.log("Image Path:", base64Image);
        console.log("Width:", width);
        console.log("Height:", height);

        // Block'u bul
        const block = await Block.findById(blockId);
        if (!block) {
            return next(new ErrorHandler(`Block not found with ID: ${blockId}`, 404));
        }

        // Cloudinary yüklemesi
        const cloudinaryResult = await cloudinary.v2.uploader.upload(base64Image, {
            folder: "krs",
            resource_type: "auto",
        });

        // Yeni Saloon nesnesi oluştur
        const newSaloon = {
            saloonName,
            image: {
                url: cloudinaryResult.secure_url,
                public_id: cloudinaryResult.public_id,
                width: parseInt(width, 10),
                height: parseInt(height, 10),
            },
        };

        // Block'a yeni Saloon'u ekle ve kaydet
        block.saloon.push(newSaloon);
        await block.save();

        const lastSaloonIndex = block.saloon.length - 1;
        const lastSaloon = block.saloon[lastSaloonIndex];
        console.log("Last Saloon:", lastSaloon);
        console.log("backend:", lastSaloon.image.url);
        console.log("cloudinary",cloudinaryResult.secure_url);

        // Python işlemi
        const pythonResponse = await sendImageToPython(lastSaloon,block, res);
        console.log("Python Response:", pythonResponse);

        if (pythonResponse.success) {
            return res.status(200).json({
                saloonName,
                imagePath: cloudinaryResult.secure_url,
                dimensions: {
                    width: lastSaloon.image.width,
                    height: lastSaloon.image.height,
                },
                message: `Saloon created successfully under block ${blockId}`,
            });
        }

        return next(new ErrorHandler("Error processing image from Python", 500));
    } catch (error) {
        console.error("Error while creating saloon:", error);
        return next(new ErrorHandler("Saloon cannot be created", 500));
    }
});


export const AdminGetSaloon = catchAsyncErrors(async (req, res, next) => {

    try {
        const block = await Block.findById(req.params.id);

        if (!block) {
            return next(new ErrorHandler("Block not found", 404));
        }

        const saloons = block.saloon;

        if (saloons.length === 0) {
            return res.status(404).json({ message: "No saloons found in this block" });
        }

        return res.status(200).json({ saloons });
    } catch (error) {
        
        console.log(error);
        return next(new ErrorHandler("Cannot retrieve saloons", 500));
    }
});


