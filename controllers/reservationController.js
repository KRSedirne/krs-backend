import Reservation from '../models/reservation.js';
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Suspended from '../models/suspended.js';
import { checkUserBreakExpireTime } from '../utils/autoCheckerFunctions.js';
import { generateQr } from '../utils/qrCodeGenerator.js';
import Seat from '../models/seat.js';
import moment from 'moment';
import '../node_modules/moment/locale/tr.js';
import { convertTime } from '../utils/time.js';


// Get all reservations
export const getAllReservations = catchAsyncErrors(async (req, res, next) => {
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

// Get a reservation
export const getReservationDetails = catchAsyncErrors(async (req, res, next) => {
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

// Create a reservation
export const createReservation = catchAsyncErrors(async (req, res, next) => {
    try {

        const user = req?.user?._id;
        const isUserSuspended = await Suspended.findOne({ user: user, type: "reservation" });
        const seat = await Seat.findById(req?.body?.seat);

        if (isUserSuspended) {
            return next(new ErrorHandler(`This user is suspended`, 401));
        }

        const isUserReservation = await Reservation.findOne({ user: user, expireTime: { $gt: new Date() } });

        if (isUserReservation) {
            return next(new ErrorHandler("User already have a reservation", 409));
        }

        const isReservationExist = await Reservation.findOne({ seat: req?.body?.seat, expireTime: { $gt: new Date() } });

        if (isReservationExist) {
            return next(new ErrorHandler("This seat already reserved", 409));
        }

        const reservation = {
            ...req?.body,
            user: user,
            reservationDate: new Date().getTime(),
            qrCode: await generateQr(user),
            expireTime: new Date(new Date().getTime() + 90 * 60 * 1000)
        }

        seat.isBooked = true;
        await seat.save();
        const response = await Reservation.create(reservation);
        return res.status(201).json({ response, message: "Reservation created successfully" });

    } catch (error) {
        return next(new ErrorHandler(`Reservation couldn't create, something is gone wrong... ${error.message}`, 500));
    }
});

// Update a reservation
export const updateReservation = catchAsyncErrors(async (req, res, next) => {
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

// Cancel a reservation
export const cancelReservation = catchAsyncErrors(async (req, res, next) => {
    try {

        let reservation = await Reservation.findById(req?.params?.id);

        if (!reservation) {
            return next(new ErrorHandler("Reservation not found", 404));
        }

        const seat = await Seat.findById(reservation?.seat);

        if (!seat) {
            return next(new ErrorHandler("Seat not found", 404));
        }

        seat.isBooked = false;
        await seat.save();
        await reservation.deleteOne();

        return res.status(204).json({ message: `Reservation deleted successfully ${req?.params?.id}` });
    } catch (error) {
        return next(new ErrorHandler("Reservation not found", 404));
    }
});


// Get reservation expire time
export const getReservationExpireTime = catchAsyncErrors(async (req, res, next) => {
    try {

        const response = await Reservation.findById(req?.body?.id);

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

// Add out Reason
export const addOutReason = catchAsyncErrors(async (req, res, next) => {

    try {

        console.log(req?.params?.id);

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
            time: req?.body?.time,
            description: req?.body?.description
        }

        setTimeout(() => {
            checkUserBreakExpireTime(req?.params?.id, outReason);
        }, req?.body?.time * 60 * 1000);

        response.qrCode = await generateQr(response?.user);
        response?.outReason.push(outReason);

        response.expireTime = response.expireTime + (req?.body?.time * 60 * 1000);

        response.isCheckIn = false;
        await response.save();

        return res.status(200).json({ response, message: "Out Reason added successfully" });

    } catch (error) {
        return next(new ErrorHandler(`Something is gone wrong... ${error.message}`, 500));
    }

});

// Get QR Code
export const getQRCode = catchAsyncErrors(async (req, res, next) => {
    try {
        //deletable code
        const user = req?.user;
        const response = await Reservation.findOne({ user: user });
        //const response = await Reservation.findById(req?.params?.id);

        if (!response) {
            return next(new ErrorHandler("Reservation not found", 404));
        }

        if (response?.expireTime < new Date()) {
            return next(new ErrorHandler("Reservation expired", 400));
        }

        return res.status(200).json({ qrCode: response?.qrCode });

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Something is gone wrong...", 500));
    }
});

// Remain Reservation
export const remainReservation = catchAsyncErrors(async (req, res, next) => {
    try {

        const response = await Reservation.findById(req?.params?.id);

        if (!response) {
            return next(new ErrorHandler("Reservation not found", 404));
        }

        if (!response?.isCheckIn) {
            return next(new ErrorHandler("User is not in the library", 400));
        }

        response.expireTime = new Date(new Date(response?.expireTime).getTime() + (90 * 60 * 1000));
        await response.save();

        const reservationDate = convertTime(response.reservationDate, 'tr', 'dddd, D MMMM YYYY HH:mm:ss');
        const expireDate = convertTime(response.expireTime, 'tr', 'dddd, D MMMM YYYY HH:mm:ss');

        const reservation = {
            id: response._id,
            user: response.user,
            reservationDate: reservationDate,
            qrCode: response.qrCode,
            outReason: response.outReason,
            isCheckIn: response.isCheckIn,
            expireTime: expireDate
        }

        return res.status(200).json({ response, message: `Reservation remain successfully, 1.5 hour `});

    } catch (error) {
        return next(new ErrorHandler(`Reservation cannot be remain ,something is gone wrong... ${error.message}`, 500));
    }
});

export const getCurrentUserReservation = catchAsyncErrors(async (req, res, next) => {
    try {
        const user = req?.user?._id;
        const reservation = await Reservation.findOne({ user: user });
        const seat = await Seat.findById(reservation?.seat);


        if (!reservation) {
            return res.status(200).json({ message: "User doesn't have any reservation" });
        }

        if (!seat) {
            return next(new ErrorHandler("Seat not found", 404));
        }

        if (reservation.expireTime < new Date()) {
            return next(new ErrorHandler(`Reservation expired`, 400));
        }

        const reservationDate = convertTime(reservation.reservationDate, 'tr', 'dddd, D MMMM YYYY HH:mm:ss');
        const expireTime = convertTime(reservation.expireTime, 'tr', 'dddd, D MMMM YYYY HH:mm:ss');

        const response = {
            id: reservation._id,
            user: reservation.user,
            reservationDate: reservationDate,
            qrCode: reservation.qrCode,
            outReason: reservation.outReason,
            isCheckIn: reservation.isCheckIn,
            expireTime: expireTime,
            seat: seat.seatNumber,
            block: seat.block,
            saloon: seat.saloonName
        }

        return res.status(200).json({ response });
    } catch (error) {
        return next(new ErrorHandler(`Reservation not found ${error.message}`, 404));
    }
});