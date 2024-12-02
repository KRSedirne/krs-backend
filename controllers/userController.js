import User from "../models/user.js"
import bcrypt from "bcryptjs"
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

export const getUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req?.params?.id });
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }
        res.status(200).json({
            succes: true,
            data: user
        });
    } catch (error) {
        return next(new ErrorHandler("User not found", 404));
    }
});

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    try {
        const users = await User.find();
        // burada users.length === 0 kontolu olmalı
        res.status(200).json({
            succes: true,
            data: users
        });
    } catch (error) {
        return next(new ErrorHandler("Users not found", 404));
    }
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return next(new ErrorHandler('Please enter old password and new password', 400));
    }
    try {
        const userId = req?.user?._id;

        const user = await User.findOne({ _id: userId }).select('+password');
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return next(new ErrorHandler('Old password is incorrect', 400));
        }

        if (await bcrypt.compare(newPassword, user.password)) {
            return next(new ErrorHandler('New password cannot be the same as old password', 400));
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ message: 'Password updated succesfully' });
    } catch (error) {
        return next(new ErrorHandler('Password could not be updated', 500));
    }
});
