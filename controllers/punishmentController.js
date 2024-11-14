import punishmentUseCases from "../useCases/punishmentUseCases.js";

// Get all punishments
export const getAllPunishments = async (req, res) => {
    try {
        const response = await punishmentUseCases.getPunishments();
        return res.status(200).json({ response });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

// Get a punishment
export const getPunishment = async (req, res) => {
    try {
        const id = req?.params?.id;
        const response = await punishmentUseCases.getPunishmentById(id);
        return res.status(200).json({ response });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

// Create a punishment
export const createPunishment = async (req, res) => {
    try {
        const response = await punishmentUseCases.createPunishment(req?.body);
        return res.status(200).json({ response, message: "Punishment created successfully" });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

// Update a punishment
export const updatePunishment = async (req, res) => {
    try {
        const punishment = {
            id: req?.params?.id,
            ...req.body
        }
        const response = await punishmentUseCases.updatePunishment(punishment);
        return res.status(200).json({ response, message: `Punishment Updated successfully ${req?.params?.id}` });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

// Delete a punishment
export const deletePunishment = async (req, res) => {
    try {
        await punishmentUseCases.deletePunishment(req?.params?.id);
        return res.status(200).json({ message: `Punishment deleted successfully ${req?.params?.id}` });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}