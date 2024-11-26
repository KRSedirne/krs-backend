import User from "../models/user.js"
import bcrypt from "bcryptjs"
import { generateId } from "../utils/idGenerator.js";


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

export const updateUser = async (req, res) => {
    try{
        const user = await User.findOneAndUpdate({userId: req.params.userId});
        
        if(!user){
            return res.status(404).json({
                succes: false,
                message: "User not found"
            });
        }
        
        if(req.body.email !== user.email){
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

export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Old Password and New Password is required!' });
    }
    try {
        const userId = req?.user?._id;

        const user = await User.findOne( {_id: userId}).select('+password'); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is wrong!' });
        }

        if (await bcrypt.compare(newPassword, user.password)) {
            return res.status(400).json({ message: "New Password and Old Password can't be same" });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ message: 'Password updated succesfully' });
    } catch (error) {
        console.error('Password update error', error);
        return res.status(500).json({ message: 'Server error!' });
    }
}