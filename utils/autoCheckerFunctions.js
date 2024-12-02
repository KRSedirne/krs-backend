import cron from "node-cron";
import { createSuspended } from "./createSuspended.js";
import Locker from "../models/locker.js";
import ErrorHandler from "./errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Reservation from "../models/reservation.js";

// Check locker reservations and suspend the users if they didn't return the locker key on time
export const autoCancelLockerReservation = catchAsyncErrors(async () => {
    try {
        const fiveDays = 5 * 24 * 60 * 60 * 1000 //5*24*60* 60 * 1000; 
        const unavaliableLockers = await Locker.find({ isBooked: true });
        const now = new Date();

        unavaliableLockers.forEach(async (locker) => {
            const lockerReservationDate = new Date(locker.updatedAt);

            if ((now - lockerReservationDate) > fiveDays) {
                const data = {
                    user: locker.user,
                    type: "locker",
                    description: "User didn't return the locker key. Suspended for a week.",
                    expireTime: (now.getTime() + (7 * 24 * 60 * 60 * 1000))
                };
                await createSuspended(data);

                locker.isBooked = false;
                locker.user = null;
                await locker.save();
                return next(new ErrorHandler(`${locker.user} got suspended for not returning locker key for ${locker._id} `, 200));
            }
        });
    } catch (error) {
        return next(new ErrorHandler("Locker reservation couldn't be cancelled automaticly.", 500));
    }
});

// Check reservations and suspend the users if they didn't check-in on time
export const autoCheckReservation = catchAsyncErrors(async () => {
    try {
        const reservations = await Reservation.find({ isCheckIn: false });
        const now = new Date();

        reservations.forEach(async (reservation) => {

            if (now > reservation.reservationDate) {
                const data = {
                    user: reservation.user,
                    type: "reservation",
                    description: "User didn't check-in on time. Suspended for a 2 week.",
                    expireTime: (now.getTime() + (14 * 24 * 60 * 60 * 1000))
                }
                await createSuspended(data);
            }

        });
    } catch (error) {
        return next(new ErrorHandler("Reservation couldn't be checked-in automaticly.", 500));
    }
});

// Check suspended users and delete them if their suspension time is over
export const autoCheckSuspendedUsers = catchAsyncErrors(async () => {
    try {
        const suspendedUsers = await Suspended.find();
        const now = new Date();

        suspendedUsers.forEach(async (suspendedUser) => {
            if (now > suspendedUser.expireTime) {
                await Suspended.findByIdAndDelete(suspendedUser._id);
            }
        });
    } catch (error) {
        return next(new ErrorHandler("Suspended users couldn't be checked automaticly.", 500));
    }
});