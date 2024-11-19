import Rezervation from '../models/rezervation.js';
import { generateId } from "../utils/idGenerator.js";

// Get all rezervations
export const getAllRezervations = async (req, res) => {
    try {
        const response = await Rezervation.find();

        if (response.length === 0) {
            throw new Error("Rezervations not found");
        }

        return res.status(200).json({ response });
    } catch (error) {
        return res.status(404).json({ message: "Rezervations not found, something is gone wrong..." });
    }
}

// Get a rezervation
export const getRezervationDetails = async (req, res) => {
    try {
        const id = req?.params?.id;
        const response = await Rezervation.findOne({ id: id });

        if (!response) {
            throw new Error("Rezervation not found with this ID");
        }

        return res.status(200).json({ response });
    } catch (error) {
        return res.status(404).json({ message: "Rezervation not found with this ID" });
    }
}

// Create a rezervation
export const createRezervation = async (req, res) => {
    try {

        const id = generateId();
        req.body.id = id;

        const isIdExist = await Rezervation.findOne({ id: id });

        if (isIdExist) {
            throw new Error(`Id already exist ${req?.body.id}`);
        }

        const isRezervationExist = await Rezervation.findOne({ rezervationDate: req?.body.rezervationDate, seat: req?.body.seat });

        if (isRezervationExist) {
            throw new Error("Rezervation already exist");
        }

        const response = await rezervationUseCases.createRezervation(req?.body);
        return res.status(200).json({ response, message: "Rezervation created successfully" });
    } catch (error) {
        return res.status(409).json({ message: "Rezervation couldn't create, something is gone wrong..." });
    }
}

// Update a rezervation
export const updateRezervation = async (req, res) => {
    try {
        const rezervation = {
            id: req?.params?.id,
            ...req.body
        }

        const response = await Rezervation.findOneAndUpdate({ id: rezervation.id }, rezervation, { new: true });

        if (!response) {
            throw new Error("Rezervation not found");
        }

        return res.status(200).json({ response, message: `Rezervation Updated successfully ${req?.params?.id}` });
    } catch (error) {
        return res.status(404).json({ message: "Rezervation not found" });
    }
}

// Delete a rezervation
export const deleteRezervation = async (req, res) => {
    try {

        const id = req?.params?.id;
        const rezervation = await Rezervation.findOne({ id: id });
        await rezervation.deleteOne();

        return res.status(200).json({ message: `Rezervation deleted successfully ${req?.params?.id}` });
    } catch (error) {
        return res.status(404).json({ message: "Rezervation not found" });
    }
}

