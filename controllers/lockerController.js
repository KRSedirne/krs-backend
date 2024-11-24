import Locker from "../models/locker.js";
import cron from "node-cron"

//listing all lockers
export const getAllLockers=async(req,res)=>{
    try{
        const response=await Locker.find();
        if(response.length===0){
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
            throw new Error(`Couldn\'t find any locker id match with ${id}`);
        }
        return res.status(200).json({response});    
    }
    catch(e){
        return res.status(400).json({message:`Something went wrong. Couldn't find any locker with ${id}`})
    }
}
export const reserveLocker=async(req,res)=>{
    try{
        const id=req.params.id;
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
        res.status(200).json({message:`Locker reserved by ${locker.user}`,locker});
    }
    catch(e){
        res.status(400).json({message:"Error locker cannot be reserved"},e);
    }
}
/* 
 export const lockerReservationTimerExpairedByAuto=async(req,res)=>{
    const fiveDays = 5 * 24 * 60 * 60 * 1000;
    cron.schedule('0 0 * * *', async () => {//min hour day(days of the week) month year 
        try{
            const unavaliableLockers=await Locker.find({isBooked:true});
        const unformatedDate=new Date();
        const now = new Date(`${unformatedDate.getFullYear()}-${unformatedDate.getMonth() + 1}-${unformatedDate.getDate()}`) ;
        unavaliableLockers.forEach(async locker => {
        const lockerReservationDate= new Date(`${locker.updatedAt.getFullYear()}-${locker.updatedAt.getMonth() + 1}-${locker.updatedAt.getDate()}`); 
        if(lockerReservationDate-now>fiveDays){
            //TODO add suspended to user 
            locker.isBooked = false;
            locker.user = null;
            await locker.save();
        }});
        }
        catch(e){
            res.status(400).json({message:"Error locker connot be free."},e);
        }
    })
 }
    */
 export const lockerReservationTimerExpairedByAuto=async(req,res)=>{
    const fiveDays = 5 *  60 * 1000;
    cron.schedule('/2 * * * *', async () => {//min hour day(days of the week) month year 
        try{
            const unavaliableLockers=await Locker.find({isBooked:true});
        const unformatedDate=new Date();
        const now = new Date(`${unformatedDate.getFullYear()}-${unformatedDate.getMonth() + 1}-${unformatedDate.getDate()}`) ;
        unavaliableLockers.forEach(async locker => {
        const lockerReservationDate= new Date(`${locker.updatedAt.getFullYear()}-${locker.updatedAt.getMonth() + 1}-${locker.updatedAt.getDate()}`); 
        if(lockerReservationDate-now>fiveDays){
            //TODO add suspended to user 
            locker.isBooked = false;
            locker.user = null;
            await locker.save();
        }});
        }
        catch(e){
            res.status(400).json({message:"Error locker connot be free."},e);
        }
    })
 }