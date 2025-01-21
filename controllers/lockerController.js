import Locker from "../models/locker.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

//listing all lockers
export const getAllLockers = catchAsyncErrors(async (req, res, next) => {
    try {
        const response = await Locker.find();
        if (response.length === 0) {
            return next(new ErrorHandler("Lockers not found", 404));
        }

        return res.status(200).json({ response });
    }
    catch (e) {
        return next(new ErrorHandler("Lockers cannot found, something is gone wrong...", 404));
    }
});

//get a specific locker 
export const getLockerDetails = catchAsyncErrors(async (req, res, next) => {
    try {
        const id = req?.params?.id;
        const response = await Locker.findOne({ _id: id });
        if (!response) {
            return next(new ErrorHandler(`Couldn\'t find any locker id match with ${id}`, 404));
        }
        return res.status(200).json({ response });
    }
    catch (e) {
        return next(new ErrorHandler(`Couldn't find any locker with ${id}`, 404));
    }
});

export const reserveLocker = catchAsyncErrors(async (req, res, next) => {
    try {
        const id = req?.params?.id;
        const user = req?.user;
        const locker = await Locker.findById(id);

        const isSuspended = await Suspended.findOne({ user: user, type: "locker" })

        if (isSuspended) {
            return next(new ErrorHandler("Error user is suspended.", 401));
        }

        if (!locker) {
            return next(new ErrorHandler(`Couldn\'t find any locker id match with ${id}`, 404));
        }
        if (await Locker.findOne({ user: user, isBooked: true })) {
            return next(new ErrorHandler("Error user has active locker reservation.", 409));
        }
        if (locker.isBooked) {
            return next(new ErrorHandler("Error locker is already reserved.", 409));
        }

        locker.isBooked = true;
        locker.user = user;
        await locker.save();
        res.status(200).json({ message: `Locker reserved by ${locker.user}`, locker });
    }
    catch (e) {
        return next(new ErrorHandler(`Error locker cannot be reserved`, 500));
    }
});

export const getCurrentUserLocker = catchAsyncErrors(async (req, res, next) => {
    try {
        const user = req?.user?._id;
        const locker = await Locker.findOne({ user: user });
        if (!locker) {
            return next(new ErrorHandler("Locker not found", 404));
        }

        if (locker.isBooked && locker.updatedAt < new Date(new Date().getTime())) {
            return res.status(200).json({ locker });
        }
        // buraya daha kod gelicek

    } catch (e) {
        return next(new ErrorHandler("Locker not found", 404));
    }
});

