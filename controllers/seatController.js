import Seat from "../models/seat.js";

// Get all seats
export const getAllSeats = async (req, res) => {
    try {
        const response = await Seat.find();

        if (response.length === 0) {
            throw new Error("Seats not found");
        }

        return res.status(200).json({ response });
    } catch (error) {
        return res.status(404).json({ message: "Seats not found, something is gone wrong..." });
    }
}

// Get a seat
export const getSeatDetails = async (req, res) => {
    try {
        const response = await Seat.findOne({ _id: id });

        if (!response) {
            throw new Error("Seat not found with this ID");
        }

        return res.status(200).json({ response });
    } catch (error) {
        return res.status(404).json({ message: "Seat not found with this ID" });
    }
}

// Create a seat
export const createSeat = async (req, res) => {
    try {

        req.body.id = _id;

        const isIdExist = await Seat.findOne({ id: id });

        if (isIdExist) {
            throw new Error(`Id already exist ${req?.body.id}`);
        }

        const isSeatExist = await Seat.findOne({ seatNumber: req?.body.seatNumber, salonName: req?.body.salonName, blockName: req?.body.blockName });

        if (isSeatExist) {
            throw new Error("Seat already exist");
        }

        const response = await Seat.create(req?.body);
        return res.status(200).json({ response, message: "Seat created successfully" });
    } catch (error) {
        return res.status(409).json({ message: "Seat couldn't create, something is gone wrong..." });
    }
}

// Update a seat
export const updateSeat = async (req, res) => {
    try {
        const seat = {
            id: req?.params?.id,
            ...req.body
        }

        const response = await Seat.findOneAndUpdate({ id: seat.id }, seat, { new: true });

        if (!response) {
            throw new Error("Punishment not found with this ID");
        }

        return res.status(200).json({ response, message: `Seat Updated successfully ${req?.params?.id}` });
    } catch (error) {
        return res.status(404).json({ message: "Seat not found with this ID" });
    }
}

// Delete a seat
export const deleteSeat = async (req, res) => {
    try {

        const id = req?.params?.id;
        let seat = await Seat.findOne({ id: id });
        await seat.deleteOne();

        return res.status(200).json({ message: `Seat deleted successfully ${req?.params?.id}` });
    } catch (error) {
        return res.status(404).json({ message: "Seat not found with this ID" });
    }
}

