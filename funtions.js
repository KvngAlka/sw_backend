import Services from "./models/Services.js";
import Subservices from "./models/Subservices.js";
import User from "./models/User.js";


export const convertService = async(list)=>{

    const newPosts =  await Promise.all(
        list.map(async(item) =>{

            const {serviceId, subServiceId, ownerId} = item;
            const services = await Services.find({code : serviceId});
            const subServices = await Subservices.find({parentCode : serviceId, code : subServiceId})

            const service = services[0]?._doc;
            const subService = subServices[0]?._doc;
            const serviceName = service?.name;

            const client = await getUserById(ownerId)


            return {
                ...item._doc,
                ...service,
                ...subService,
                serviceName,
                nameOfClient : client?.fullName,
                location : client.location
                
            }

        })

    ) 

    return newPosts;

}



export async function getUserById(id){

    const user = await User.find({_id : id});

    if(user) return user[0];

    else return null

}