import { Router } from "express";
import User from "../models/User.js";
import { authToken } from "./verifyToken.js";


const userRouter  = Router();



userRouter.put("/profile/edit",authToken,async(req,res)=>{

    const {body} = req;

    const user = await User.updateOne({phoneNumber : req.user.phoneNumber},{body})

    res.send(user)

})




export {userRouter}