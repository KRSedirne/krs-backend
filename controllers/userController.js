import User from "../models/user.js"
import {generateId} from "../utils/idGenerator.js"

export const createUser = async (req, res) => {
    try{
        const userId = generateId();

        const existingUser = await User.findOne({email: req.body.email});
        if(existingUser){
            return res.status(400).json({
                succes: false,
                message: "User already exists"});
        }
        const newUser = await User.create({
            id:userId,
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,  
            password: req.body.password,
            role: req.body.role
        });
        res.status(201).json({
            succes: true,
            data: newUser
        });
    }catch(error){
        res.status(400).json({
            succes: false,
            message: error.message
        });
    }
}

export const updateUser = async (req, res) => {
    try{
        const user = await User.findOneAndUpdate({userId: req.params.userId});
        
        if(!user){
            return res.status(404).json({
                succes: false,
                message: "User not found"
            });
        }
        
        if(req.body.email && req.body.email !== user.email){
            const existingUser = await User.findOne({email: req.body.email});
            if(existingUser){
                return res.status(400).json({
                    succes: false,
                    message: "User already exists"
                });
            }
        }
        const updatedUser = await User.findOneAndUpdate(
            {userId: req.params.userId},
            {
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email, 
            password: req.body.password, 
            role: req.body.role
        },
        {new: true, runValidators: true});

        res.status(200).json({
            succes: true,
            data: updatedUser
        });

    }catch(error){
        res.status(400).json({
            succes: false,
            message: error.message
        });
    }
}

export const deleteUser = async (req, res) => {
    try{
        const user = await User.findOne({id: req.params.id});
        if(!user){
            return res.status(404).json({
                succes: false,
                message: "User not found"
            });
        }
        await user.deleteOne();
        res.status(200).json({
            succes: true,
            message: "User deleted successfully"
        });
    }catch(error){
        res.status(400).json({
            succes: false,
            message: error.message
        });
    }
}

export const getUser = async (req, res) => {
    try{
        const user = await User.findOne({id: req?.params?.id});
        if(!user){
            return res.status(404).json({
                succes: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            succes: true,
            data: user
        });
    }catch(error){
        res.status(400).json({
            succes: false,
            message: error.message
        });
    }
}

export const getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json({
            succes: true,
            data: users
        });
    }catch(error){
        res.status(400).json({
            succes: false,
            message: error.message
        });
    }
}