import Punishment from "../models/punishment.js";
import { generateId } from "../utils/idGenerator.js";

// Get all punishments
export const getAllPunishments = async (req, res) => {
    try {
        const response = await Punishment.find();
        return res.status(200).json({ response });
    } catch (error) {
        return res.status(404).json({ message: "Punishments not found" });
    }
}

// Get a punishment
export const getPunishment = async (req, res) => {
    try {
        const id = req?.params?.id;
        const response = await Punishment.findById(id);
        return res.status(200).json({ response });
    } catch (error) {
        return res.status(404).json({ message: "punishment not found" });
    }
}

// Create a punishment
export const createPunishment = async (req, res) => {
    try {

        const id = generateId();
        req.body.id = id;

        const isIdExist = await Punishment.findOne({ id: req?.body.id });

        if (isIdExist) {
            throw new Error(`Id already exist ${req?.body.id}`);
        }

        const response = await Punishment.create(req?.body);
        return res.status(200).json({ response, message: "Punishment created successfully" });
    } catch (error) {
        return res.status(404).json({ message: "Punishment couldn't create, something is gone wrong..." });
    }
}

// Update a punishment
export const updatePunishment = async (req, res) => {
    try {
        const punishment = {
            id: req?.params?.id,
            ...req.body
        }

        const response = await Punishment.findByIdAndUpdate(punishment.id, punishment, { new: true });

        return res.status(200).json({ response, message: `Punishment Updated successfully ${req?.params?.id}` });
    } catch (error) {
        return res.status(404).json({ message: "Punishment not found" });
    }
}

// Delete a punishment
export const deletePunishment = async (req, res) => {
    try {

        let punishment = await Punishment.findById(req?.params.id);
        await punishment.deleteOne();

        return res.status(200).json({ message: `Punishment deleted successfully ${req?.params?.id}` });
    } catch (error) {
        return res.status(404).json({ message: "Punishment not found" });
    }
}