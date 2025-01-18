import Seat from "../models/seat.js";
import Block from "../models/block.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

// Get all seats
export const getAllSeats = catchAsyncErrors(async (req, res, next) => {
    try {
        const response = await Seat.find();

        if (response.length === 0) {
            return next(new ErrorHandler("Seats not found", 404));
        }

        return res.status(200).json({ response });
    } catch (error) {
        return next(new ErrorHandler("Seats not found, something is gone wrong...", 404));
    }
});

// Get a seat
export const getSeatDetails = catchAsyncErrors(async (req, res, next) => {
    try {
        const response = await Seat.findById(req?.params?.id);

        if (!response) {
            return next(new ErrorHandler("Seat not found with this ID", 404));
        }

        return res.status(200).json({ response });
    } catch (error) {
        return next(new ErrorHandler("Seat not found with this ID", 404));
    }
});

// Create a seat
export const createSeat = catchAsyncErrors(async (req, res, next) => {
    try {

        const isIdExist = await Seat.findById(req?.params?.id);

        if (isIdExist) {
            return next(new ErrorHandler(`Id already exist ${req?.body.id}`, 409));
        }

        const isSeatExist = await Seat.findOne({ seatNumber: req?.body.seatNumber, salonName: req?.body.salonName, blockName: req?.body.blockName });

        if (isSeatExist) {
            return next(new ErrorHandler("Seat already exist", 409));
        }

        const response = await Seat.create(req?.body);
        return res.status(200).json({ response, message: "Seat created successfully" });
    } catch (error) {
        return next(new ErrorHandler("Seat couldn't create, something is gone wrong...", 500));
    }
});

// Update a seat
export const updateSeat = catchAsyncErrors(async (req, res, next) => {
    try {

        const response = await Seat.findByIdAndUpdate(req?.params?.id, req?.body, { new: true });

        if (!response) {
            return next(new ErrorHandler("Seat not found with this ID", 404));
        }

        return res.status(200).json({ response, message: `Seat Updated successfully ${req?.params?.id}` });
    } catch (error) {
        return next(new ErrorHandler("Seat not found with this ID", 404));
    }
});

// Delete a seat
export const deleteSeat = catchAsyncErrors(async (req, res, next) => {
    try {
        let seat = await Seat.findById(req?.params?.id);
        await seat.deleteOne();

        return res.status(204).json({ message: `Seat deleted successfully ${req?.params?.id}` });
    } catch (error) {
        return next(new ErrorHandler("Seat not found with this ID", 404));
    }
});

//find Seat belong Saloon

export const getSeatsBySaloonId = async (req, res) => {
    try {
        const { saloonId } = req.params;

        const block = await Block.findOne({ "saloon._id": saloonId });

        if (!block) {
            return res.status(404).json({ message: "Block with the specified saloonId not found" });
        }

        const saloon = block.saloon.find(s => s._id.toString() === saloonId);

        if (!saloon) {
            return res.status(404).json({ message: "Saloon not found in the block" });
        }

        const saloonName = saloon.saloonName;

        const seats = await Seat.find({ saloonName });

        return res.status(200).json({
            success: true,
            seats,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

