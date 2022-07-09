import { Router } from "express";
import { authToken } from "./verifyToken.js";
import ClientPost from "../models/ClientPost.js";
import { validateClientPost } from "../validation.js";


const postRouter  = Router();



postRouter.post("/add",authToken,async(req,res)=>{

    const {body} = req;

    const {error} = validateClientPost(body);
    if(error) return res.status(400).send(error.details[0].message)

    const post = new ClientPost({...body, isAccepted : false});
    const savedPost = await post.save();

    res.status(201).send(savedPost);

})




export {postRouter}