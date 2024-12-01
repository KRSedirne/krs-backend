import Locker from "../../models/locker.js";
import Punishment from "../../models/punishment.js";
import User from "../../models/user.js";

//listing all lockers
export const adminGetAllLockers=async(req,res)=>{
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
export const adminGetLockerDetails=async(req,res)=>{
    try
    {
        const id = req?.params?.id;
        const response= await Locker.findById(id);
        if (!id) {
            return res.status(400).json({ message: "Locker ID is required." });
        }
        if(!response){
            throw new Error(`Couldn\'t find any locker id match with ${id}`);
        }
        return res.status(200).json({response});    
    }
    catch(e){
        return res.status(400).json({message:`Something went wrong. Couldn't find any locker with ${id}`})
    }
}
//create a new locker
export const adminCreateLocker=async(req,res)=>{
    try{
        if(await Locker.findById(req?.body?.id)){
            throw new Error("ID already exits");
        }
        
        if (await Locker.findOne({ lockerNumber: req?.body?.lockerNumber })) {
            throw new Error("Locker number has been given to someone else");
        }
        const response=await Locker.create(req?.body);
        return res.status(201).json({response,message:"Locker created successfully"});
    }
    catch(e){
        return res.status(400).json({message:"Error can't create the locker."})
    }
    
}
//update a locker
export const adminUpdateLocker=async(req,res)=>{
        try{
            const id=req?.params?.id;
            const updates=req?.body;
             const updatedLocker=await Locker.findOneAndUpdate({_id:id},updates,{
                new:true,
                runValidators:true
             });
             if(!updateLocker){
                return res.status(404).json({message:"Locker not found."});
             }
             res.status(200).json({message:"Locker updated successfully",updatedLocker});
        }catch(e){
            res.status(400).json({message:"Error updating locker",error:e.message});
        }
}
//delete a locker
export const adminDeleteLocker=async(req,res)=>{
    try{
        const id=req?.params?.id;
        const deletedLocker=await Locker.findOneAndDelete({_id:id});
        if(!deletedLocker){
            return res.status(404).json({message:"Locker not found."});
        }
        res.status(200).json({message:"Locker deleted successfully",deleteLocker});
    }
    catch(e){
        res.status(400).json({message:"Error deleting locker",e});
    }
}

export const adminReserveLocker = async (req, res) => {
    try {
        const id = req?.params?.id; 
        const userEmail = req?.body?.email;
        const user=await User.findOne({email:userEmail});
        const isSuspended=await Punishment.findOne({user:user,type:"locker"})

         const locker = await Locker.findById(id);
        if (!locker) {
            return res.status(404).json({ message: "Locker not found" });
        }
        if (locker.isBooked) {
            return res.status(400).json({ message: "This locker is already reserved." });
        }
        const doesUserHaveResLocker = await Locker.findOne({ user: user, isBooked: true });

        if (doesUserHaveResLocker) {
            return res.status(400).json({ message: "Error: User already has an active reservation." });
        }
        if(isSuspended){
            return res.status(400).json({message:"Error user's request decline. User suspended"});
        }
        

        locker.isBooked = true;
        locker.user = user;
        await locker.save();

        res.status(200).json({ message: `Locker reserved by ${locker.user}`, locker });
    } catch (e) {
        console.error("Error:", e);
        res.status(500).json({ message: "Locker cannot be reserved.", error: e.message });
    }
};


export const adminCancelLockerReservation=async(req,res)=>{
    try{
        const id=req?.params?.id;
        const locker=await Locker.findOne({_id:id});
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
export const adminExpandReservation=async(req,res)=>
{
    try{
        const id=req?.params?.id;
        const locker=await Locker.findOne({_id:id});
        if(!locker){
            return res.status(404).json({message:"Locker not Found"});
        }
        if(!locker.isBooked){
            return res.status(400).json({message:"This locker isn't reserved. "});
        }
        await locker.save();
        res.status(200).json({message:"Locker reservation date expanded"});
    }
    catch(e){
        res.status(400).json({message:"Error reservation cannot be expanded"});
    }
}