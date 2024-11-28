import Locker from "../models/locker.js";

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
        const response= await Locker.findOne({_id:id});
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
        const id=req?.params?.id;
        const user=req?.body?.user;
        const locker=await Locker.findOne({_id:id});
        if(Locker.findOne({user:user})){
            return res.status(400).json({message:"Error user has active locker reservation."})
        }
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

  
