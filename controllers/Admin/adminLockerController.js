import Locker from "../../models/locker.js";
import Suspended from "../../models/suspended.js";
import User from "../../models/user.js";
import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middlewares/catchAsyncErrors.js";


//listing all lockers
export const adminGetAllLockers = catchAsyncErrors(async (req, res, next) => {
    try {
        const response = await Locker.find();
        if (response.length === 0) {
            return next(new ErrorHandler("Lockers not found!", 404));
        }

        return res.status(200).json({ response });
    }
    catch (e) {
        return next(new ErrorHandler("Lockers not found", 404));
    }
});

//get a specific locker 
export const adminGetLockerDetails = catchAsyncErrors(async (req, res, next) => {
    try {
        const id = req?.params?.id;
        const response = await Locker.findById(id);
        if (!response) {
            return next(new ErrorHandler("Locker not found", 404));
        }
        return res.status(200).json({ response });
    }
    catch (e) {
        return next(new ErrorHandler("Locker not found", 404));
    }
});

//create a new locker
export const adminCreateLocker = catchAsyncErrors(async (req, res, next) => {
    try {

        const locker = await Locker.findOne({ lockerNumber: req?.body?.lockerNumber })

        if (locker) {
            return next(new ErrorHandler("Locker number already exits", 409));
        }
        const response = await Locker.create(req?.body);
        return res.status(201).json({ response, message: "Locker created successfully" });
    }
    catch (e) {
        return next(new ErrorHandler("Locker couldn't create, something gone wrong...", 500));
    }
});

//update a locker
export const adminUpdateLocker = catchAsyncErrors(async (req, res, next) => {
    try {
        const id = req?.params?.id;
        const updates = req?.body;
        const updatedLocker = await Locker.findOneAndUpdate({ _id: id }, updates, {
            new: true,
        });
        if (!updatedLocker) {
            return next(new ErrorHandler("Locker not found", 404));
        }
        res.status(200).json({ message: "Locker updated successfully", updatedLocker });
    } catch (e) {
        return next(new ErrorHandler("Locker couldn't update, something gone wrong...", 500));
    }
});

//delete a locker
export const adminDeleteLocker = catchAsyncErrors(async (req, res, next) => {
    try {
        const id = req?.params?.id;
        const deletedLocker = await Locker.findOneAndDelete({ _id: id });
        if (!deletedLocker) {
            return next(new ErrorHandler("Locker not found", 404));
        }
        res.status(204).json({ message: "Locker deleted successfully" });
    }
    catch (e) {
        return next(new ErrorHandler("Locker couldn't delete, something gone wrong...", 500));
    }
});

export const adminReserveLocker = catchAsyncErrors(async (req, res, next) => {
    try {
        const id = req?.params?.id;
        const user = req?.body?.user;
        const isSuspended = await Suspended.findOne({ user: user, type: "locker" })

        const locker = await Locker.findById(id);
        if (!locker) {
            return next(new ErrorHandler("Locker not found", 404));
        }
        if (locker.isBooked) {
            return next(new ErrorHandler("This locker is already reserved.", 409));
        }
        const doesUserHaveResLocker = await Locker.findOne({ user: user, isBooked: true });

        if (doesUserHaveResLocker) {
            return next(new ErrorHandler("User already has an active reservation...", 409));
        }
        if (isSuspended) {
            return next(new ErrorHandler("user's request decline. User suspended", 400))
        }


        locker.isBooked = true;
        locker.user = user;
        await locker.save();

        res.status(200).json({ message: `Locker reserved by ${locker.user}`, locker });
    } catch (e) {
        return next(new ErrorHandler("Locker cannot be reserved.", 500));
    }
});

export const adminCancelLockerReservation = catchAsyncErrors(async (req, res, next) => {
    try {
        const id = req?.params?.id;
        const locker = await Locker.findById(id);
        if (!locker) {
            return next(new ErrorHandler("Locker not found", 404));
        }
        if (!locker.isBooked) {
            return next(new ErrorHandler("This locker isn't reserved. ", 400));
        }
        locker.isBooked = false;
        locker.user = null;
        await locker.save();//for saving in the db
        res.status(200).json({ message: "Locker reservation got cancelled.", locker });
    }
    catch (e) {
        return next(new ErrorHandler("Error locker reservation not cancelled.", 500));
    }
});

//it doesn't exit to Abdullah's code
export const adminExpandReservation = async (req, res) => {
    try {
        const id = req?.params?.id;
        const locker = await Locker.findOne({ _id: id });
        if (!locker) {
            return res.status(404).json({ message: "Locker not Found" });
        }
        if (!locker.isBooked) {
            return res.status(400).json({ message: "This locker isn't reserved. " });
        }
        await locker.save();
        res.status(200).json({ message: "Locker reservation date expanded" });
    }
    catch (e) {
        res.status(400).json({ message: "Error reservation cannot be expanded" });
    }
}
