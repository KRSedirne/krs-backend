import Saloon from '../../models/saloon';
import ErrorHandler from '../../utils/errorHandler';
import catchAsyncErrors from '../../middlewares/catchAsyncErrors';

// Admin get all saloons
export const adminGetAllSaloons = catchAsyncErrors(async (req, res, next) => {
    try {
        const response = await Saloon.find();

        if (response.length === 0) {
            return next(new ErrorHandler("Saloons not found", 404));
        }

        return res.status(200).json({ response });
    } catch (error) {
        return next(new ErrorHandler("Saloons not found, something is gone wrong...", 404));
    }
});

// Admin get a saloon
export const adminGetSaloonDetails = catchAsyncErrors(async (req, res, next) => {
    try {
        const response = await Saloon.findById(req?.params?.id);

        if (!response) {
            return next(new ErrorHandler("Saloon not found with this ID", 404));
        }

        return res.status(200).json({ response });
    } catch (error) {
        return next(new ErrorHandler("Saloon not found with this ID", 404));
    }
});

// Admin create a saloon
export const adminCreateSaloon = catchAsyncErrors(async (req, res, next) => {
    try {
        const isSaloonExist = await findOne({ name: req?.body?.name });

        if (isSaloonExist) {
            return next(new ErrorHandler("Saloon already exist", 409));
        }

        const response = await Saloon.create(req?.body);
        return res.status(200).json({ response, message: "Saloon created successfully" });
    } catch (error) {
        return next(new ErrorHandler("Saloon couldn't create, something is gone wrong...", 500));
    }
});

// Admin update a saloon
export const adminUpdateSaloon = catchAsyncErrors(async (req, res, next) => {
    try {
        const response = await Saloon.findByIdAndUpdate(req?.params?.id, req?.body, { new: true });

        if (!response) {
            return next(new ErrorHandler("Saloon not found with this ID", 404));
        }
        return res.status(200).json({ response, message: "Saloon updated successfully" });
    } catch (error) {
        return next(new ErrorHandler("Saloon couldn't update, something is gone wrong...", 500));
    }
});

// Admin delete a saloon
export const adminDeleteSaloon = catchAsyncErrors(async (req, res, next) => {
    try {
        const response = await Saloon.findByIdAndDelete(req?.params?.id);

        if (!response) {
            return next(new ErrorHandler("Saloon not found with this ID", 404));
        }
        return res.status(200).json({ response, message: "Saloon deleted successfully" });
    } catch (error) {
        return next(new ErrorHandler("Saloon couldn't delete, something is gone wrong...", 500));
    }
});
