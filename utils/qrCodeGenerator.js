import QRCode from "qrcode";
import Reservation from "../models/reservation";
 
export const generateQr = async (req, res) => {
    const { userId, reservationId } = req.body;

    try {

        const reservation = await Reservation.findOne({ _id: reservationId, userId });
        if (!reservation) {
            return res.status(404).json({ message: 'Rezervasyon bulunamadı!' });
        }

        const qrData = {
            reservationId: reservation._id,
            userId: reservation.user._id,
        };

        const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

        reservation.qrCode = qrCode;
        await reservation.save();

        res.status(200).json({ message: "QR code generated succesfuly!", qrCode });
    } catch (error) {
        console.error('QR kod oluşturulurken hata:', error);
        res.status(500).json({ message: "QR code couldn't be generated ." });
    }
};

export const isCheckingQr = async (req, res) => {
    const { qrString } = req.body; 

    try {
        const qrData = JSON.parse(qrString);
        const { reservationId, userId } = qrData;

        const reservation = await Reservation.findOne({ _id: reservationId, userId });
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found!' });
        }

        if (reservation.isCheckIn) {
            return res.status(400).json({ message: 'Reservation already exist!' });
        }

        reservation.isCheckIn = true;
        await reservation.save();

        res.status(200).json({ message: 'Reservation approved!' });

        setTimeout(async () => {
            const updateReservation = await Reservation.findOne({ _id: reservationId });
            if (updateReservation && updateReservation.isCheckIn) {
                updateReservation.isCheckIn = false;
                await updateReservation.save();
                console.log(`Reservation ${reservationId} canceled.`);
            }
        }, 1.5 * 60 * 60 * 1000);
    } catch (error) {
        console.error('QR code verification error:', error);
        res.status(500).json({ message: 'QR code verification is not success.' });
    }
};


