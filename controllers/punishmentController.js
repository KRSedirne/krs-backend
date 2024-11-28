import Punishment from "../models/punishment.js";
import { createSuspended } from "../utils/createSuspended.js";

// Get all punishments
export const getAllPunishments = async (req, res) => {
    try {
        const response = await Punishment.find();

        if (response.length === 0) {
            throw new Error("Punishments not found");
        }

        return res.status(200).json({ response });
    } catch (error) {
        return res.status(404).json({ message: "Punishments not found, something is gone wrong..." });
    }
}

// Get a punishment
export const getPunishmentDetails = async (req, res) => {
    try {
        const id = req?.params?.id;
        const response = await Punishment.findOne({ _id: id });

        if (!response) {
            throw new Error("punishment not found with this ID");
        }

        return res.status(200).json({ response });
    } catch (error) {
        return res.status(404).json({ message: "punishment not found with this ID" });
    }
}

// Create a punishment
// export const createPunishment = async (req, res) => {
//     try {

//         const id = generateId();
//         req.body.id = id;

//         const isIdExist = await Punishment.findOne({ id: id });

//         if (isIdExist) {
//             throw new Error(`Id already exist ${req?.body.id}`);
//         }

//         const isPunishmentExist = await Punishment.findOne({ punishmentDate: req?.body.punishmentDate, punishmentType: req?.body.punishmentType });

//         if (isPunishmentExist) {
//             throw new Error("Punishment already exist");
//         }

//         const response = await Punishment.create(req?.body);
//         return res.status(200).json({ response, message: "Punishment created successfully" });
//     } catch (error) {
//         return res.status(404).json({ message: "Punishment couldn't create, something is gone wrong..." });
//     }
// }
//not tested waiting for check
export const createPunishment = async (req, res) => {
    try {
        req.body.user= req?.user?.id;
        id=req.body.id ;

        const isIdExist = await Punishment.findOne({ _id: id });

        if (isIdExist) {
            throw new Error(`Id already exist ${req?.body?.id}`);
        }

        const isPunishmentExist = await Punishment.findOne({ punishmentDate: req?.body.punishmentDate, punishmentType: req?.body.punishmentType });

        if (isPunishmentExist) {
            throw new Error("Punishment already exist");
        }
        const suspendedData={
            user:req.body.user,
            type:req.body.type,
            description:req.body.description,
            expaireTime:req.body.expaireTime,
        }
        const response = await createPunishment(suspendedData);
        return res.status(200).json({ response, message: "Punishment created successfully" });
    } catch (error) {
        return res.status(404).json({ message: error.message});
    }
}

// Update a punishment
export const updatePunishment = async (req, res) => {
    try {
        const punishment = {
            id: req?.params?.id,
            ...req.body
        }

        const response = await Punishment.findOneAndUpdate({ _id: punishment.id }, punishment, { new: true });

        if (!response) {
            throw new Error("Punishment not found with this ID");
        }

        return res.status(200).json({ response, message: `Punishment Updated successfully ${req?.params?.id}` });
    } catch (error) {
        return res.status(404).json({ message: "Punishment not found with this ID" });
    }
}

// Delete a punishment
export const deletePunishment = async (req, res) => {
    try {

        const id = req?.params?.id;
        let punishment = await Punishment.findOne({ _id: id });
        await punishment.deleteOne();

        return res.status(200).json({ message: `Punishment deleted successfully ${req?.params?.id}` });
    } catch (error) {
        return res.status(404).json({ message: "Punishment not found with this ID" });
    }
}