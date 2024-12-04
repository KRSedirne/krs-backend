import QRCode from "qrcode";
import Reservation from "../models/reservation.js";
import ErrorHandler from "./errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

export const generateQr = async (userId) => {

    try {
        const qrData = {
            userId: userId
        };
        const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

        return qrCode;
    } catch (error) {
        return next(new ErrorHandler('QR code generation failed!', 500));
    }
};

export const isCheckingQr = catchAsyncErrors(async (req, res) => {
    const { qrString } = req.body;

    try {
        const qrData = JSON.parse(qrString);
        const { reservationId, userId } = qrData;

        const reservation = await Reservation.findOne({ _id: reservationId, userId });
        if (!reservation) {
            return next(new ErrorHandler('Reservation not found!', 404));
        }

        if (reservation.isCheckIn) {
            return next(new ErrorHandler('Reservation already approved!', 409));
        }

        reservation.isCheckIn = true;
        await reservation.save();

        res.status(200).json({ message: 'Reservation approved!' });

        // setTimeout(async () => {
        //     const updateReservation = await Reservation.findOne({ _id: reservationId });
        //     if (updateReservation && updateReservation.isCheckIn) {
        //         updateReservation.isCheckIn = false;
        //         await updateReservation.save();
        //         console.log(`Reservation ${reservationId} canceled.`);
        //     }
        // }, 1.5 * 60 * 60 * 1000);
    } catch (error) {
        return next(new ErrorHandler('QR code validation failed!', 500));
    }
});


