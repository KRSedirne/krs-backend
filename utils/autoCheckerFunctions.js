import Locker from "../models/locker.js";
import ErrorHandler from "./errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Reservation from "../models/reservation.js";
import Suspended from "../models/suspended.js";
import Seat from "../models/seat.js";

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
                await Suspended.create(data);

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

// Check user reservation expire time and if ended, end the reservation
export const autoEndReservation = catchAsyncErrors(async () => {
    try {
        const reservations = await Reservation.find();
        const now = new Date();

        reservations.forEach(async (reservation) => {
            if (now > reservation.expireTime) {
                if (reservation.isCheckIn) {
                    const seat = await Seat.findById(reservation.seat);
                    if (seat) {
                        seat.isBooked = false;
                        console.log("autoendReservation Seat updated:", seat);
                        await seat.save();
                    }
                    await reservation.deleteOne();
                    console.log("Reservation ended successfully.");
                }
                else {
                    const suspendedUser = await Suspended.findOne({ user: reservation.user, type: "reservation" });
                    if (!suspendedUser) {
                        const data = {
                            user: reservation.user,
                            type: "reservation",
                            description: "User didn't check-in on time. Suspended for a 2 week.",
                            expireTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
                        }
                        console.log("autoendResercation Data:",data);
                        await Suspended.create(data);
                    }
                    await reservation.deleteOne();
                    console.log("Reservation deleted and user suspended.");
                }
            }
        });
    } catch (error) {
        return next(new ErrorHandler("Reservation couldn't be ended automaticly.", 500));
    }
});

// Check reservation Date and suspend the users if they didn't check-in on time (15 min)
export const autoCheckReservation = catchAsyncErrors(async () => {
    try {
        const reservations = await Reservation.find({ isCheckIn: false });
        const now = new Date();

        reservations.forEach(async (reservation) => {

            const reservationDeadline = new Date(reservation.createdAt.getTime() + 15 * 60 * 1000);

            if (now > reservationDeadline) {
                const seat = await Seat.findById(reservation.seat);

                if (seat) {
                    seat.isBooked = false; 
                    await seat.save();
                }

                const suspendedUser = await Suspended.findOne({ user: reservation.user, type: "reservation" });
                if (!suspendedUser) {
                    const data = {
                        user: reservation.user,
                        type: "reservation",
                        description: "User didn't check-in within 15 minutes. Suspended for 2 weeks.",
                        expireTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
                    };
                    await Suspended.create(data); 
                }
                await reservation.deleteOne();
                console.log(`Reservation ${reservation._id} was not checked in and has been removed.`);
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

// Check user is returned from break or not
export const checkUserBreakExpireTime = catchAsyncErrors(async (reservationId, outReason) => {
    try {

        const reservation = await Reservation.findById(reservationId);

        const returnTime = new Date(outReason.date + outReason.time);
        const now = new Date();

        if ((now > returnTime) && (reservation.isCheckIn === false)) {
            const data = {
                user: reservation.user,
                type: "reservation",
                description: "User didn't return from break on time. Suspended for a 1 week.",
                expireTime: (now.getTime() + (7 * 24 * 60 * 60 * 1000))
            }
            await Suspended.create(data);
        }

    } catch (error) {
        return next(new ErrorHandler("Suspended user couldn't checked, something is wrong...", 500));
    }
});