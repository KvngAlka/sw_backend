import { Router } from "express";
import User from '../models/User.js'



let router = Router();

router.get("/all/users", async(req,res)=>{
    const allUsers = await User.find();
    res.json({
        users : allUsers
    })
    
})





export default router