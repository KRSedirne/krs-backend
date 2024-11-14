import Rezervation from '../models/rezervation.js';

// Get all rezervations
export const getRezervations = async () => {
    return await Rezervation.find();
}

// Get a rezervation
export const getRezervationById = async (id) => {
    const rezervation = await Rezervation.findById(id);

    if (!rezervation) {
        throw new Error("Rezervation not found");
    }

    return rezervation;
}

// Create a rezervation
export const createRezervation = async (rezervation) => {
    const isRezervationExist = await Rezervation.findOne({ rezervationDate: rezervation.rezervationDate, rezervationTime: rezervation.rezervationTime, rezervationType: rezervation.rezervationType });

    if (isRezervationExist) {
        throw new Error("Rezervation already exist");
    }

    return await Rezervation.create(rezervation);
}

// Update a rezervation
export const updateRezervation = async (id, rezervation) => {
    const updatedRezervation = await Rezervation.findByIdAndUpdate(id, rezervation, { new: true });

    if (!updatedRezervation) {
        throw new Error("Rezervation not found");
    }

    return updatedRezervation;
}

// Delete a rezervation
export const deleteRezervation = async (id) => {
    const deletedRezervation = await Rezervation.findByIdAndDelete(id);

    if (!deletedRezervation) {
        throw new Error("Rezervation not found");
    }

    return true;
}