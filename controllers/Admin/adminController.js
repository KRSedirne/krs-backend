import ErrorHandler from '../../utils/errorHandler.js';
import catchAsyncErrors from '../../middlewares/catchAsyncErrors.js';
import Reservation from '../../models/reservation.js';

export const isCheckingQr = catchAsyncErrors(async (req, res, next) => {
    const { qrCode } = req.body; 
    if (!qrCode) {
        return next(new ErrorHandler('QR code is missing!', 400)); 
    }

    try {
        console.log("Received QR Code:", qrCode);

        if (!qrCode) {
            return next(new ErrorHandler('Invalid QR code format!', 400)); 
        }

        const reservations = await Reservation.find();

        let matchedReservation = null;
        for (let reservation of reservations) {
            console.log("Reservation QR Code:", reservation.qrCode);

            if (reservation.qrCode === qrCode) {
                matchedReservation = reservation;
                console.log("Matched Reservation:", matchedReservation);
                break; 
            }
        }

        if (!matchedReservation) {
            return next(new ErrorHandler('No matching reservation found for the QR code!', 404));
        }

        res.status(200).json({
            message: 'Reservation found!',
            userId: matchedReservation.user, 
        });
    } catch (error) {
        console.error("Error in isCheckingQr:", error.message);
        return next(new ErrorHandler('QR code validation failed!', 500));
    }
});