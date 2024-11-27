import User from "../models/user.js"


export const adminCreateUser = async (req, res) => {
    try{

        const existingUser = await User.findOne({email: req.body.email});
        if(existingUser){
            return res.status(400).json({
                succes: false,
                message: "User already exists"});
        }
        const newUser = new User({
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

export const adminUpdateUser = async (req, res) => {
    try{
        const user = await User.findOne({_id: req?.params?.id});
        
        if(!user){
            return res.status(404).json({
                succes: false,
                message: "User not found"
            });
        }
        
        const updatedUser = await User.findOneAndUpdate(
            {_id: req?.params?.id},
            {
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email, 
            password: req.body.password, 
        },
        {new: true, runValidators: true});

        res.status(200).json({
            success: true,
            data: updatedUser
        });

    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

export const adminDeleteUser = async (req, res) => {
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

export const adminGetUser = async (req, res) => {
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

export const adminGetAllUsers = async (req, res) => {
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