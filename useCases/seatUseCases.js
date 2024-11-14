import Seat from "../models/seat.js";

// Get all seats
export const getSeats = async () => {
    return await Seat.find();
}

// Get a seat
export const getSeatById = async (id) => {
    const seat = await Seat.findById(id);

    if (!seat) {
        throw new Error("Seat not found");
    }

    return seat;
}

// Create a seat
export const createSeat = async (seat) => {
    const isSeatExist = await Seat.findOne({ seatNumber: seat.seatNumber, salonName: seat.salonName, blockName: seat.blockName });

    if (isSeatExist) {
        throw new Error("Seat already exist");
    }

    return await Seat.create(seat);
}

// Update a seat
export const updateSeat = async (id, seat) => {
    const updatedSeat = await Seat.findByIdAndUpdate(id, seat, { new: true });

    if (!updatedSeat) {
        throw new Error("Seat not found");
    }

    return updatedSeat;
}

// Delete a seat
export const deleteSeat = async (id) => {
    const deletedSeat = await Seat.findByIdAndDelete(id);

    if (!deletedSeat) {
        throw new Error("Seat not found");
    }

    return deletedSeat;
}