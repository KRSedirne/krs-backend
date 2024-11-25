import Punishment from "../models/punishment";
export default createPunishment = async ({id,user,type,description,expiareTime}) => {
    try {
        const data={
            id:id,
            user:user,
            type:type,
            description:description,
            expiareTime:expiareTime
        };
        const punishment = await Punishment.create(data);
       return punishment;
    }
    catch(e){
        throw new Error();
    }}