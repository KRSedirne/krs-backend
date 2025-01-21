import Suspended from "../../models/suspended.js";
import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middlewares/catchAsyncErrors.js";
// import User from "../../models/user.js";

// Admin Get all suspendeds
export const adminGetAllSuspendeds = catchAsyncErrors(async (req, res, next) => {
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

// Admin Get a suspended
export const adminGetSuspendedDetails = catchAsyncErrors(async (req, res, next) => {
    try {

        const suspended = await Suspended.findById(req?.params?.id);

        if (!suspended) {
            return next(new ErrorHandler("Suspended not found with this ID", 404));
        }

        return res.status(200).json({ suspended });
    } catch (error) {
        return next(new ErrorHandler("Suspended not found with this ID", 404));
    }
});

// Admin Create a suspended
export const adminCreateSuspended = catchAsyncErrors(async (req, res, next) => {
    try {

        // bu kısım eklenince hata atıyor
        // const user = await User.findById(req?.body?.user);

        // if (!user) {
        //     return next(new ErrorHandler("User not found with this ID", 404));
        // }

        let suspendTime = (req?.body?.expireTime)

        if (req?.body?.type === "reservation") {
            suspendTime += (14 * 24 * 60 * 60 * 1000);
        }
        if (req?.body?.type === "locker") {
            suspendTime += (5 * 24 * 60 * 60 * 1000);
        }

        const isSuspendedExist = await Suspended.findOne({ user: req?.params?.id, type: req?.body.type });

        if (isSuspendedExist && (suspendTime > new Date())) {
            return next(new ErrorHandler("Suspended already exist", 409));
        }

        const response = await Suspended.create(req?.body);
        return res.status(200).json({ response, message: "Suspended created successfully" });
    } catch (error) {
        return next(new ErrorHandler("Suspended couldn't create, something is gone wrong...", 500));
    }
});

// Admin Update a suspended
export const adminUpdateSuspended = catchAsyncErrors(async (req, res, next) => {
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

//  Admin Delete a suspended
export const adminDeleteSuspended = catchAsyncErrors(async (req, res, next) => {
    try {
        let suspended = await Suspended.findById(req?.params?.id);
        await suspended.deleteOne();

        return res.status(204).json({ message: `Suspended deleted successfully ${req?.params?.id}` });
    } catch (error) {
        return next(new ErrorHandler("Suspended not found with this ID", 404));
    }
});

// Check suspended time is expired or not
export const adminManuallyCheckSuspended = catchAsyncErrors(async (req, res, next) => {

    try {

        const suspended = await Suspended.findById(req?.params?.id);

        if (!suspended) {
            return next(new ErrorHandler("Suspended not found with this ID", 404));
        }

        let currentDate = new Date();
        let expireTime = new Date(suspended?.expireTime);

        if (currentDate > expireTime) {
            await suspended.deleteOne();
            return res.status(200).json({ message: "Suspended period is over, user suspended deleted successfully" });
        } else {
            return res.status(200).json({ message: "Suspended period is not over" });
        }

    } catch (error) {
        return next(new ErrorHandler("Suspended user couldn't checked, something is wrong...", 500));
    }

});

