import ErrorHandler from '../../utils/errorHandler.js';
import catchAsyncErrors from '../../middlewares/catchAsyncErrors.js';
import Reservation from '../../models/reservation.js';
import User from '../../models/user.js';

export const isCheckingQr = catchAsyncErrors(async (req, res, next) => {
    const { qrCode } = req.body;

    if (!qrCode) {
        return next(new ErrorHandler('QR code is missing!', 400));
    }

    try {
        console.log("Received QR Code:", qrCode);

        const reservations = await Reservation.find();
        
        const matchedReservation = reservations.find(reservation => reservation.qrCode === qrCode);

        if (matchedReservation) {
            console.log("Matched Reservation:", matchedReservation);
        } else {
            console.log("No reservation found with the given QR code.");
        }

        if (!matchedReservation) {
            return next(new ErrorHandler('No matching reservation found for the QR code!', 404));
        }

        matchedReservation.isCheckIn = true;
        await matchedReservation.save();

        res.status(200).json({
            message: 'Reservation found and check-in status updated!',
            userId: matchedReservation.user,
        });
    } catch (error) {
        console.error("Error in isCheckingQr:", error.message);
        return next(new ErrorHandler('QR code validation failed!', 500));
    }
});

export const adminCheckInManually = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    console.log(email);

    if (!email) {
        return next(new ErrorHandler('Email is missing!', 400));
    }

    try {
        console.log("Recived Email:", email);
        const user=await User.findOne({email:email});
        const reservation=await Reservation.findOneAndUpdate({user:user._id},{isCheckIn:true},{new: true, runValidators: true});

        
        if (reservation) {
            console.log("Matched Reservation:", reservation);
        } else {
            console.log("No reservation found.");
        }

        res.status(200).json({
            message: 'Reservation found and check-in status updated!',
            userId: reservation.user,
        });
    } catch (error) {
        console.error("Error in ManuelCheckin:", error.message);
        return next(new ErrorHandler('Manuel Check in failed!', 500));
    }
});
