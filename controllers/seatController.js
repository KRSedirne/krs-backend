import seatUseCases from "../useCases/seatUseCases.js";

// Get all seats
export const getAllSeats = async (req, res) => {
    try {
        const response = await seatUseCases.getSeats();
        return res.status(200).json({ response });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

// Get a seat
export const getSeat = async (req, res) => {
    try {
        const id = req?.params?.id;
        const response = await seatUseCases.getSeatById(id);
        return res.status(200).json({ response });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

// Create a seat
export const createSeat = async (req, res) => {
    try {
        const response = await seatUseCases.createSeat(req?.body);
        return res.status(200).json({ response, message: "Seat created successfully" });
    } catch (error) {
        return res.status(409).json({ message: error.message });
    }
}

// Update a seat
export const updateSeat = async (req, res) => {
    try {
        const seat = {
            id: req?.params?.id,
            ...req.body
        }
        const response = await seatUseCases.updateSeat(seat);
        return res.status(200).json({ response, message: `Seat Updated successfully ${req?.params?.id}` });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

// Delete a seat
export const deleteSeat = async (req, res) => {
    try {
        await seatUseCases.deleteSeat(req?.params?.id);
        return res.status(200).json({ message: `Seat deleted successfully ${req?.params?.id}` });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

