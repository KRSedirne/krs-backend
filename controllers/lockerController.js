import Locker from "../models/locker";
import {generateId} from "../utils/idGenerator"

//listing all lockers
export const getAllLockers=async(req,res)=>{
    try{
        const response=await Locker.find();
        if(response.lenght===0){
            throw new Error("Lockers not found");
        }
        return res.status(200).json({response});
    }
    catch (e){
        return res.status(400).json({message:"Lockers cannot found."})
    }
}
//get a specific locker 
export const getLockerDetails=async(req,res)=>{
    try
    {
        const id=req?.params?.id;
        const response= await Locker.findOne({id:id});
        if(!response){
            throw new Error('Couldn\'t find any locker id match with ${id}');
        }
        return res.status(200).json({response});    
    }
    catch(e){
        return res.status(400).json({message:"Something went wrong. Couldn't find any locker with "+id+"."})
    }
}
//create a new locker
export const createLocker=async(req,res)=>{
    try{
        const id=generateId();
        req.body.id=id;
        if(!await Locker.findOne({id:id})){
            throw new Error("ID already exits");
        }
        req.body.isBooked=false;
        const response=await Locker(req?.body);
        return res.status(201).json({response,message:"Seat created successfully"});
    }
    catch(e){
        return res.status(400).json({message:"Error can't create the locker."})
    }
    
}
//update a locker
export const updateLocker=async(req,res)=>{
        try{
            const id=req.body.id;
            const updates=req.body;
             const updatedLocker=await Locker.findOneAndUpdate(id,updates,{
                new:true,
                runValidators:true
             });
             if(!updateLocker){
                return res.status(404).json({message:"Locker not found."});
             }
             res.status(200).json({message:"Locker updated successfully",updatedLocker});
        }catch(e){
            res.status(400).json({message:"Error updating locker",error});
        }
}
//delete a locker
export const deleteLocker=async(req,res)=>{
    try{
        const id=req.body.id;
        const deletedLocker=await Locker.findOneAndDelete({id});
        if(!deleteLocker){
            return res.status(404).json({message:"Locker not found."});
        }
        res.status(200).json({message:"Locker deleted successfully",deleteLocker});
    }
    catch(e){
        res.status(400).json({message:"Error deleting locker",error});
    }
}
export const reserveLocker=async(req,res)=>{
    try{
        const id=req.body.id;
        const user=req.body.user;
        const locker=await Locker.findOne({id:id});
        if(!locker){
            return res.status(404).json({message:"Locker not Found"});
        }
        if(locker.isBooked){
            return res.status(400).json({message:"This locker already reserved"});
        }
        locker.isBooked=true;
        locker.user=user;
        await locker.save();
        res.status(200).json({message:"Locker reserved by ${locker.user}",locker});
    }
    catch(e){
        res.status(400).json({message:"Error locker cannot be reserved"},e);
    }
}
export const cancelLockerReservation=async(req,res)=>{
    try{
        const id=req.body.id;
        const locker=await Locker.findOne({id:id});
        if(!locker){
            return res.status(404).json({message:"Locker not Found"});
        }
        if(!locker.isBooked){
            return res.status(400).json({message:"This locker isn't reserved. "});
        }
        locker.isBooked=false;
        locker.user=null;
        await locker.save();//for saving in the db
        res.status(200).json({message:"Locker reservation got cancelled.",locker});
    }
    catch(e){
        res.status(400).json({message:"Error locker reservation not cancelled."},e);
    }
}