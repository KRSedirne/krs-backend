import Punishment from "../models/punishment.js";

// Get all punishments
export const getPunishments = async () => {
    return await Punishment.find();
}

// Get a punishment
export const getPunishmentById = async (id) => {
    const punishment = await Punishment.findById(id);

    if (!punishment) {
        throw new Error("Punishment not found");
    }

    return punishment;
}

// Create a punishment
export const createPunishment = async (punishment) => {

    const isPunishmentExist = await Punishment.findOne({ punishmentType: punishment.punishmentType, punishmentDate: punishment.punishmentDate, punishmentReason: punishment.punishmentReason });

    if (isPunishmentExist) {
        throw new Error("Punishment already exist");
    }

    return await Punishment.create(punishment);
}

// Update a punishment
export const updatePunishment = async (id, punishment) => {
    const updatedPunishment = await Punishment.findByIdAndUpdate(id, punishment, { new: true });

    if (!updatedPunishment) {
        throw new Error("Punishment not found");
    }

    return updatedPunishment;
}

// Delete a punishment
export const deletePunishment = async (id) => {
    const deletedPunishment = await Punishment.findByIdAndDelete(id);

    if (!deletedPunishment) {
        throw new Error("Punishment not found");
    }

    return deletedPunishment;
}