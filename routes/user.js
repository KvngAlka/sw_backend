import { Router } from "express";
import User from "../models/User.js";
import { validateUserEdit } from "../validation.js";
import { authToken } from "./verifyToken.js";
import bcrypt from 'bcryptjs'
import Services from "../models/Services.js";
import Subservices from "../models/Subservices.js";


const userRouter  = Router();



userRouter.put("/profile/edit",authToken,async(req,res)=>{
    const {body} = req;

    let {error}  = validateUserEdit(body);
    if(error) return res.send({code : 400,msg : error.details[0].message});

    const update = await User.updateOne({_id : body._id},{$set : {...body}});
    const {acknowledged} = update;

    if(acknowledged){
        const findUser = await User.find({_id : body._id});
        const newUser = findUser[0]  //the user will be the first user found
        res.send({msg : "Update Successful", data : newUser})
    }else{
        res.send({msg : "Failed to update", code : 400})
    }

})


userRouter.put("/profile/update/isActive",authToken,async(req,res)=>{
    const {body} = req;
    if(body.isActive === null || body.isActive === undefined) 
    return res.send({code : 401, msg : "Bad request"})

    const update = await User.updateOne({_id : body._id},{$set : {isActive : body.isActive}});
    const {acknowledged} = update;

    if(acknowledged){
        const findUser = await User.find({_id : body._id});
        const newUser = findUser[0]  //the user will be the first user found
        res.send({msg : "Update Successful", data : newUser})
    }else{
        res.send({msg : "Failed to update", code : 400})
    }
})




userRouter.post("/profile/delete",authToken,async(req,res)=>{
    const {phoneNumber,password,_id} = req.body;
    if(!phoneNumber || !password || !_id)return res.send({code : 401, msg : "Phone Number and Password required"})

    const user = await User.find({phoneNumber, _id })[0];

    if(!user) return res.send({code : 401, msg : "User does not exist"})

    if(user){
        const valid = await bcrypt.compare(password, user.password);
        if(valid){
            //DELETE EVERYTHING ABOUT USER
            const userDelete = await User.deleteOne({phoneNumber,_id})
            console.log("This is res for the user deleted", userDelete)
        }else{
            res.send({code : 400, msg : "phone number or password is wrong"})
        }
    }
})


//FOR WORKERS


userRouter.post("/profile/get/worker/skills",authToken, async(req,res)=>{
    const {workerId} = req.body;
    if(!workerId) return res.send({code  : 401, msg : "Bad Request"})

   
    const findUser = await User.find({_id : workerId});
    const newUser = findUser[0]  //the user will be the first user found
    const userSkills = newUser.skills;
    if(userSkills){

        const newSkills =  await Promise.all(
            userSkills.map(async(skill) =>{

                const {serviceId, subServiceId} = skill;
                const services = await Services.find({code : serviceId});
                const subServices = await Subservices.find({parentCode : serviceId, code : subServiceId})

                const service = services[0]?._doc;
                const subService = subServices[0]?._doc;
                const serviceName = service?.name;
    
    
                return {
                    ...service,
                    ...subService,
                    serviceName
                    
                }
    
            })

        ) 
        res.send({msg : "Skills Fetch Successful", data : newSkills})
    }


})

userRouter.put("/profile/update/worker/skills",authToken, async(req,res)=>{
    const {serviceId, subServiceId, workerId} = req.body;
    if(!serviceId || !subServiceId || !workerId) return res.send({code  : 401, msg : "Bad Request"})

    const update = await User.updateOne({_id : workerId},{$push : {skills : {serviceId, subServiceId}}});

    const {acknowledged} = update;
    if(acknowledged){
        const findUser = await User.find({_id : workerId});
        const newUser = findUser[0]  //the user will be the first user found
        res.send({msg : "Update Successful", data : newUser})
    }else{
        res.send({msg : "Failed to update", code : 400})
    }

})



export {userRouter}