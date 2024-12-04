import User from "../../models/user.js"
import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middlewares/catchAsyncErrors.js";


export const adminCreateUser = catchAsyncErrors(async (req, res, next) => {
    try {

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return next(new ErrorHandler('User already exists', 409));
        }
        const newUser = new User({
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
        });
        await newUser.save();
        res.status(201).json({
            succes: true,
            data: newUser
        });
    } catch (error) {
        return next(new ErrorHandler("User couldn't created", 500));
    }
});

export const adminUpdateUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req?.params?.id });

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: req?.params?.id },
            {
                name: req.body.name,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
            },
            { new: true, runValidators: true });

        res.status(200).json({
            success: true,
            data: updatedUser
        });

    } catch (error) {
        return next(new ErrorHandler("User couldn't updated", 500));
    }
});

export const adminDeleteUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const user = await User.findById(req?.params?.id);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }
        await user.deleteOne();
        res.status(204).json({
            succes: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        return next(new ErrorHandler("User couldn't deleted", 500));
    }
});

export const adminGetUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const user = await User.findById(req?.params?.id);
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

export const adminGetAllUsers = catchAsyncErrors(async (req, res, next) => {
    try {
        const users = await User.find();
        // burada users.length === 0 kontrolu olmalı
        res.status(200).json({
            succes: true,
            data: users
        });
    } catch (error) {
        return next(new ErrorHandler("Users not found", 404));
    }
});