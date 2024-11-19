import Seat from "../models/seat.js";
import { generateId } from "../utils/idGenerator.js";

// Get all seats
export const getAllSeats = async (req, res) => {
    try {
        const response = await Seat.find();

        return res.status(200).json({ response });
    } catch (error) {
        return res.status(404).json({ message: "Seats not found, something is gone wrong..." });
    }
}

// Get a seat
export const getSeat = async (req, res) => {
    try {
        const id = req?.params?.id;
        const response = await Seat.findById(id);
        return res.status(200).json({ response });
    } catch (error) {
        return res.status(404).json({ message: "Seat not found with this ID" });
    }
}

// Create a seat
export const createSeat = async (req, res) => {
    try {

        const id = generateId();
        req.body.id = id;

        const isIdExist = await Seat.findOne({ id: req?.body.id });

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

        const response = await Seat.findByIdAndUpdate(seat.id, seat, { new: true });

        return res.status(200).json({ response, message: `Seat Updated successfully ${req?.params?.id}` });
    } catch (error) {
        return res.status(404).json({ message: "Seat not found with this ID" });
    }
}

// Delete a seat
export const deleteSeat = async (req, res) => {
    try {

        let seat = await Seat.findById(req?.params?.id);
        await seat.deleteOne();

        return res.status(200).json({ message: `Seat deleted successfully ${req?.params?.id}` });
    } catch (error) {
        return res.status(404).json({ message: "Seat not found with this ID" });
    }
}

