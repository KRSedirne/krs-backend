import {generateId} from '../utils/generateId';
import User from '../models/user';

export function checkQrCode(req, res) {
    // logic will be here
}

export const createUser = async (req, res) => {
    try{
        const userId = generateId();

        const existingUser = await User.findOne({email: req.body.email});
        if(existingUser){
            return res.status(400).json({
                succes: false,
                message: "User already exists"});
        }
        const newUser = new User({
            id:userId,
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,  
            password: req.body.password,
        });
        await newUser.save();
        res.status(201).json({
            succes: true,
            data: newUser
        });
    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}