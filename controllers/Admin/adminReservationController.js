import Reservation from '../../models/reservation.js';
import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middlewares/catchAsyncErrors.js";


// Get all rezervations
export const adminGetAllReservations = catchAsyncErrors(async (req, res, next) => {
    try {
        const response = await Reservation.find();

        if (response.length === 0) {
            return next(new ErrorHandler("Reservations not found", 404));
        }

        return res.status(200).json({ response });
    } catch (error) {
        return next(new ErrorHandler("Reservations not found, something is gone wrong...", 404));
    }
});

// Get a rezervation
export const adminGetReservationDetails = catchAsyncErrors(async (req, res, next) => {
    try {

        const response = await Reservation.findById(req?.params?.id);

        if (!response) {
            return next(new ErrorHandler("Reservation not found with this ID", 404));
        }

        return res.status(200).json({ response });
    } catch (error) {
        return next(new ErrorHandler("Reservation not found with this ID", 404));
    }
});

// Create a rezervation
export const adminCreateReservation = catchAsyncErrors(async (req, res, next) => {
    try {

        req.body.user = req?.user?.id;
        req.body.seat = req?.body?.seat;

        const isIdExist = await Reservation.findById(req?.params?.id);

        if (isIdExist) {
            return next(new ErrorHandler(`Id already exist ${req?.body.id}`, 409));
        }

        // user birden fazla reservation yapamaz, kontrol et
        const isUserExist = await Reservation.findOne({ user: req?.body.user });

        if (isUserExist) {
            return next(new ErrorHandler(`This user already has one reservation`, 409));
        }

        const isReservationExist = await Reservation.findOne({ reservationDate: req?.body.reservationDate, seat: req?.body.seat });

        // böyle bir kullanım var mı kontrol et
        // if (isReservationExist.seat.booked) {
        //     return next(new ErrorHandler("Reservation already exist", 409));
        // }

        if (isReservationExist) {
            return next(new ErrorHandler("Reservation already exist", 409));
        }

        const response = await reservationUseCases.createReservation(req?.body);
        return res.status(201).json({ response, message: "Reservation created successfully" });

    } catch (error) {
        return next(new ErrorHandler("Reservation couldn't create, something is gone wrong...", 500));
    }
});

// Update a rezervation
export const adminUpdateReservation = catchAsyncErrors(async (req, res, next) => {
    try {

        let reservation = await Reservation.findById(req?.params?.id);

        if (!reservation) {
            return next(new ErrorHandler("Reservation not found", 404));
        }

        const response = await Reservation.findByIdAndUpdate(req.params?.id, req.body, { new: true });

        if (!response) {
            return next(new ErrorHandler("Reservation not found", 404));
        }

        return res.status(200).json({ response, message: `Reservation Updated successfully ${req?.params?.id}` });
    } catch (error) {
        return next(new ErrorHandler("Reservation not found", 404));
    }
});

// Delete a rezervation
export const adminDeleteReservation = catchAsyncErrors(async (req, res, next) => {
    try {

        let reservation = await Reservation.findById(req?.params.id);
        await reservation.deleteOne();

        return res.status(204).json({ message: `Reservation deleted successfully ${req?.params?.id}` });
    } catch (error) {
        return next(new ErrorHandler("Reservation not found", 404));
    }
});

