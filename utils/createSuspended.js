import Punishment from "../models/punishment.js";
export const createSuspended = async ({user,type,description,expireTime}) => {
    try {
        const data={
            user:user,
            type:type,
            description:description,
            expireTime:expireTime
        };
        const punishment = await Punishment.create(data);
       return punishment;
    }
    catch(e){
        throw new Error(`Failed to create suspended: ${user}. Error : ${e.message}`);
    }}