import { Router } from "express";
import User from './models/User.js'



let router = Router();

router.get("/all/users", async(req,res)=>{
    const allUsers = await User.find();
    res.json({
        users : allUsers
    })
    
})



router.post("/add/user", async (req, res) => {
    const body = req.body;
	const post = new User({...body})
	await post.save()
	res.send(post)
})



export default router