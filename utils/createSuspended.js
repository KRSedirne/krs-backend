import Suspended from "../models/suspended.js";
import ErrorHandler from "./errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

export const createSuspended = catchAsyncErrors(async ({ user, type, description, expireTime }) => {
    try {
        const data = {
            user: user,
            type: type,
            description: description,
            expireTime: expireTime
        };
        const suspended = await Suspended.create(data);
        return suspended;
    }
    catch (e) {
        return next(new ErrorHandler(`Failed to create suspended: ${user}. Error : ${e.message}`, 500));
    }
});