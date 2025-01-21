import Suspended from "../models/suspended.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

// Get all suspendeds
export const getAllSuspendeds = catchAsyncErrors(async (req, res, next) => {
    try {
        const response = await Suspended.find();

        if (response.length === 0) {
            return next(new ErrorHandler("Suspendeds not found", 404));
        }

        return res.status(200).json({ response });
    } catch (error) {
        return next(new ErrorHandler("Suspendeds not found, something is gone wrong...", 404));
    }
});

// Get a suspended
export const getSuspendedDetails = catchAsyncErrors(async (req, res, next) => {
    try {

        const suspended = await Suspended.findById(req?.params?.id);

        if (!suspended) {
            return next(new ErrorHandler("Suspended not found with this ID", 404));
        }

        return res.status(200).json({ response });
    } catch (error) {
        return next(new ErrorHandler("Suspended not found with this ID", 404));
    }
});

// Update a suspended
export const updateSuspended = catchAsyncErrors(async (req, res, next) => {
    try {

        let suspended = await Suspended.findById(req?.params?.id);

        if (!suspended) {
            return next(new ErrorHandler("Suspended not found with this ID", 404));
        }

        const response = await Suspended.findByIdAndUpdate(req?.params?.id, req?.body, { new: true });

        if (!response) {
            return next(new ErrorHandler("Suspended not found with this ID", 404));
        }

        return res.status(200).json({ response, message: `Suspended Updated successfully ${req?.params?.id}` });
    } catch (error) {
        return next(new ErrorHandler("Suspended not found with this ID", 500));
    }
});

// Delete a suspended
export const deleteSuspended = catchAsyncErrors(async (req, res, next) => {
    try {
        let suspended = await Suspended.findById(req?.params?.id);
        await suspended.deleteOne();

        return res.status(204).json({ message: `Suspended deleted successfully ${req?.params?.id}` });
    } catch (error) {
        return next(new ErrorHandler("Suspended not found with this ID", 404));
    }
});

// Check suspended time is expired or not
export const manuallyCheckSuspended = catchAsyncErrors(async (req, res, next) => {

    try {

        const suspended = await Suspended.findById(req?.params?.id);

        if (!suspended) {
            return next(new ErrorHandler("Suspended not found with this ID", 404));
        }

        let currentDate = new Date();
        let expireTime = new Date(suspended?.expireTime);

        if (currentDate > expireTime) {
            await suspended.deleteOne();
            return res.status(200).json({ message: "Suspended period is over" });
        } else {
            return res.status(200).json({ message: "Suspended period is not over" });
        }

    } catch (error) {
        return next(new ErrorHandler("Suspended user couldn't checked, something is wrong...", 500));
    }

});


