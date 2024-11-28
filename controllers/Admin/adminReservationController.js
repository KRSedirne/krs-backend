import Reservation from '../models/reservation.js';

// Get all rezervations
export const getAllReservations = async (req, res) => {
    try {
        const response = await Reservation.find();

        if (response.length === 0) {
            throw new Error("Reservations not found");
        }

        return res.status(200).json({ response });
    } catch (error) {
        return res.status(404).json({ message: "Reservations not found, something is gone wrong..." });
    }
}

// Get a rezervation
export const getReservationDetails = async (req, res) => {
    try {
        const id = req?.params?.id;
        const response = await Reservation.findOne({ _id: id });

        if (!response) {
            throw new Error("Reservation not found with this ID");
        }

        return res.status(200).json({ response });
    } catch (error) {
        return res.status(404).json({ message: "Reservation not found with this ID" });
    }
}

// Create a rezervation
export const createReservation = async (req, res) => {
    try {

        id=req?.body?.id ;

        const isIdExist = await Reservation.findOne({ _id: id });

        if (isIdExist) {
            throw new Error(`Id already exist ${req?.body?.id}`);
        }

        const isReservationExist = await Reservation.findOne({ reservationDate: req?.body.reservationDate, seat: req?.body.seat });

        if (isReservationExist) {
            throw new Error("Reservation already exist");
        }

        const response = await reservationUseCases.createReservation(req?.body);
        return res.status(200).json({ response, message: "Reservation created successfully" });
    } catch (error) {
        return res.status(409).json({ message: "Reservation couldn't create, something is gone wrong..." });
    }
}

// Update a rezervation
export const updateReservation = async (req, res) => {
    try {
        const reservation = {
            id: req?.params?.id,
            ...req.body
        }

        const response = await Reservation.findOneAndUpdate({ _id: reservation.id }, reservation, { new: true });

        if (!response) {
            throw new Error("Reservation not found");
        }

        return res.status(200).json({ response, message: `Reservation Updated successfully ${req?.params?.id}` });
    } catch (error) {
        return res.status(404).json({ message: "Reservation not found" });
    }
}

// Delete a rezervation
export const deleteReservation = async (req, res) => {
    try {

        const id = req?.params?._id;
        const reservation = await Reservation.findOne({ _id: id });
        await reservation.deleteOne();

        return res.status(200).json({ message: `Reservation deleted successfully ${req?.params?.id}` });
    } catch (error) {
        return res.status(404).json({ message: "Reservation not found" });
    }
}

