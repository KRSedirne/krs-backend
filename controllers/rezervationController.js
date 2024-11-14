import rezervationUseCases from '../useCases/rezervationUseCases.js';

// Get all rezervations
export const getAllRezervations = async (req, res) => {
    try {
        const response = await rezervationUseCases.getRezervations();
        return res.status(200).json({ response });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

// Get a rezervation
export const getRezervation = async (req, res) => {
    try {
        const id = req?.params?.id;
        const response = await rezervationUseCases.getRezervationById(id);
        return res.status(200).json({ response });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

// Create a rezervation
export const createRezervation = async (req, res) => {
    try {
        const response = await rezervationUseCases.createRezervation(req?.body);
        return res.status(200).json({ response, message: "Rezervation created successfully" });
    } catch (error) {
        return res.status(409).json({ message: error.message });
    }
}

// Update a rezervation
export const updateRezervation = async (req, res) => {
    try {
        const rezervation = {
            id: req?.params?.id,
            ...req.body
        }
        const response = await rezervationUseCases.updateRezervation(rezervation);
        return res.status(200).json({ response, message: `Rezervation Updated successfully ${req?.params?.id}` });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

// Delete a rezervation
export const deleteRezervation = async (req, res) => {
    try {
        await rezervationUseCases.deleteRezervation(req?.params?.id);
        return res.status(200).json({ message: `Rezervation deleted successfully ${req?.params?.id}` });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

