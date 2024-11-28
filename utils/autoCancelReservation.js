import cron from "node-cron";
import { createSuspended } from "./createSuspended.js";
import Locker from "../models/locker.js";

export const autoCancelLockerReservation = async () => {
    const fiveDays = 60*1000 //5*24*60* 60 * 1000; 
    cron.schedule('*/1 * * * *', async () => { //'00 00 * * *'
        try {
            const unavaliableLockers = await Locker.find({ isBooked: true });

            const now = new Date();

            unavaliableLockers.forEach(async (locker) => {
                const lockerReservationDate = new Date(locker.updatedAt);

                if (now - lockerReservationDate > fiveDays) {
                    const data = {
                        user: locker.user,
                        type: "locker",
                        description: "User didn't return the locker key. Suspended for a week.",
                        expireTime: (now.getTime() + (7 * 24 * 60 * 60 * 1000) )
                    };
                    await createSuspended(data);  

                
                    locker.isBooked = false;
                    locker.user = null;
                    await locker.save();
                    console.log(`${locker.user} got suspended for not returning locker key for ${locker._id} `)
                }
            });

        } catch (e) {
            console.error("Error  auto-cancel :", e);
        }
    });
};
