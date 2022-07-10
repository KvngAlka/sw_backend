import { Router } from "express";
import User from "../models/User.js";
import { validateUserEdit } from "../validation.js";
import { authToken } from "./verifyToken.js";


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


userRouter.put("/profile/activate/isActive",authToken,async(req,res)=>{
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



export {userRouter}