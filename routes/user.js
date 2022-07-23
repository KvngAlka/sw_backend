import { Router } from "express";
import User from "../models/User.js";
import { validateUserEdit } from "../validation.js";
import { authToken } from "./verifyToken.js";
import bcrypt from 'bcryptjs'


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


userRouter.put("/profile/update/worker/skills",authToken, async(req,res)=>{
    const {skills, workerId} = req.body;
    if(!skills || !workerId) return res.send({code  : 401, msg : "Bad Request"})

    const update = await User.updateOne({_id : workerId},{$set : {skills : skills}});
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



export {userRouter}