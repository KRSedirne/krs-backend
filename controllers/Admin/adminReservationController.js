import Reservation from '../../models/reservation.js';
import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middlewares/catchAsyncErrors.js";
import Suspended from "../../models/suspended.js";
import { generateQr } from "../../utils/qrCodeGenerator.js";
import Seat from "../../models/seat.js";

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

        // user birden fazla reservation yapamaz, kontrol et
        const isUserExist = await Reservation.findOne({ user: req?.body.user });

        if (isUserExist) {
            return next(new ErrorHandler(`This user already has one reservation`, 409));
        }

        const isUserSuspended = await Suspended.findOne({ user: req?.body.user });

        if (isUserSuspended) {
            return next(new ErrorHandler(`This user is suspended`, 401));
        }

        const isReservationExist = await Reservation.findOne({ reservationDate: req?.body.reservationDate, seat: req?.body.seat });

        // böyle bir kullanım var mı kontrol et
        // if (isReservationExist.seat.booked) {
        //     return next(new ErrorHandler("Reservation already exist", 409));
        // }

        if (isReservationExist) {
            return next(new ErrorHandler("Reservation already exist", 409));
        }

        const isSeatBooked = await Seat.findById(req?.body?.seat);
        if (isSeatBooked.isBooked) {
            return next(new ErrorHandler("Seat already booked", 409));
        }

        const reservation = {
            ...req?.body,
            qrCode: await generateQr(req?.body?.user),
            expireTime: new Date(Date.now() + 90 * 60 * 1000)
        }

        const response = await Reservation.create(reservation);
        return res.status(201).json({ response, message: "Reservation created successfully" });

    } catch (error) {
        return next(new ErrorHandler(`Reservation cannot create, something is gone wrong... ${error.message}`, 500));
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

// Admin Cancel a reservation
export const adminCancelReservation = catchAsyncErrors(async (req, res, next) => {
    try {

        let reservation = await Reservation.findById(req?.params?.id);

        if ((reservation.reservationDate - (24 * 60 * 60 * 1000)) < new Date()) {
            return next(new ErrorHandler("Reservation cannot be delete last day", 400));
        }

        await reservation.deleteOne();

        return res.status(204).json({ message: `Reservation deleted successfully ${req?.params?.id}` });
    } catch (error) {
        return next(new ErrorHandler("Reservation not found", 404));
    }
});


// Admin Get reservation expire time
export const adminGetReservationExpireTime = catchAsyncErrors(async (req, res, next) => {
    try {

        const response = await Reservation.findById(req?.params?.id);

        if (!response) {
            return next(new ErrorHandler("Reservation not found", 404));
        }

        let expireTime = (response?.expireTime - new Date());

        const hours = Math.floor((expireTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // to show as a hour
        const minutes = Math.floor((expireTime % (1000 * 60 * 60)) / (1000 * 60)); // to show as a minute
        const seconds = Math.floor((expireTime % (1000 * 60)) / 1000); // to show as a second

        expireTime = {
            hours: hours,
            minutes: minutes,
            seconds: seconds
        }

        return res.status(200).json({ response: expireTime });

    } catch (error) {
        return next(new ErrorHandler("Something is gone wrong...", 500));
    }
});

// Admin Add out Reason
export const adminAddOutReason = catchAsyncErrors(async (req, res, next) => {

    try {

        const response = await Reservation.findById(req?.params?.id);

        if (!response) {
            return next(new ErrorHandler("Reservation not found", 404));
        }

        if (!response?.isCheckIn) {
            return next(new ErrorHandler("User is not in the library", 400));
        }

        const outReason = {
            type: req?.body?.type,
            date: new Date(),
            time: req?.body?.time
        }

        response?.outReason.push(outReason);

        response.expireTime = response.expireTime + (req?.body?.time * 60 * 1000);

        await response.save();

        return res.status(200).json({ response, message: "Out Reason added successfully" });

    } catch (error) {
        return next(new ErrorHandler("Something is gone wrong...", 500));
    }

});

// Admin Get QR Code
export const adminGetQRCode = catchAsyncErrors(async (req, res, next) => {
    try {

        const response = await Reservation.findById(req?.params?.id);

        if (!response) {
            return next(new ErrorHandler("Reservation not found", 404));
        }

        if (response?.expireTime < new Date()) {
            return next(new ErrorHandler("Reservation expired", 400));
        }

        return res.status(200).json({ response: response?.qrCode });

    } catch (error) {
        return next(new ErrorHandler("Something is gone wrong...", 500));
    }
});

// Admin Remain Reservation
export const adminRemainReservation = catchAsyncErrors(async (req, res, next) => {
    try {

        const response = await Reservation.findById(req?.params?.id);

        if (!response) {
            return next(new ErrorHandler("Reservation not found", 404));
        }

        if (!response?.isCheckIn) {
            return next(new ErrorHandler("User is not in the library", 400));
        }

        response.expireTime = (response?.expireTime + (req?.body?.time * 60 * 1000));

        return res.status(200).json({ response, message: `Reservation remain successfully, ${req?.body?.time / 60} hour` });

    } catch (error) {
        return next(new ErrorHandler("Reservation cannot be remain ,something is gone wrong...", 500));
    }
});

