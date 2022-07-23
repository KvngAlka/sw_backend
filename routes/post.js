import { Router } from "express";
import { authToken } from "./verifyToken.js";
import ClientPost from "../models/ClientPost.js";
import { userExists, validateClientPost } from "../validation.js";
import User from "../models/User.js";


const postRouter  = Router();



postRouter.post("/add",authToken,async(req,res)=>{
    const {body} = req;
    const {error} = validateClientPost(body);
    if(error) return res.status(400).send(error.details[0].message)

    const post = new ClientPost({...body, isAccepted : false});
    const savedPost = await post.save();

    res.status(201).send(savedPost);

})


postRouter.put("/edit",authToken,async(req,res)=>{
    const {_id,ownerId} = req.body;
    const {error} = validateClientPost(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const postUpdated  = await ClientPost.updateOne({_id },{$set : {...req.body}});
    const {acknowledged} = postUpdated;
    if(acknowledged){
        const posts = await ClientPost.find({ ownerId });
        res.send({code : 201, data : posts})
    }else{
        res.send({code : 401, msg: "Failed to Edit"})
    }
})


postRouter.delete("/delete",authToken ,async(req,res)=>{

    const {body} = req;

    if(!body._id)return res.send({code: 400, msg:"Id of post required"});

    const post = await ClientPost.find({_id : body._id}); //res => POST[]

    if(post[0]){
        //CHECK IF IT'S BEING DELETED BY THE OWNER
        const isOwner = post.ownerId === body.ownerId;
        if(isOwner){
            const deletedPost = await ClientPost.remove({_id : body.id})
            res.send(deletedPost)
        }else{
            res.send({code : 400, msg : "Unauthorized to delete post"})
        }

    }else{

        res.send({code : 400, msg : "Post doesn't exist"})
    }
})



postRouter.post("/get/clientposts", authToken,async(req,res)=>{
    const {body} = req;
    if(!body._id && !body.phoneNumber) return res.send({code : 400, msg : "id or phone number required"});
    const user = await userExists(body.phoneNumber)
    if(user){
        const posts = await ClientPost.find({ownerId : body._id});
        res.send({code : 201, data : posts})
    }else{
        res.send({code : 400, msg : "UnAuthorized"})
    }

})




postRouter.post("/worker/accept/post", authToken, async(req,res)=>{
    const {postId} = req.body;

    //check if post has not been already accepted
    const post = await ClientPost.find({_id : postId})[0];
    if(post){
        if(post.isAccepted) return res.send({code : 400, msg : "Job is already taken by another worker."});

        else {
            const postUpdated = ClientPost.updateOne({_id },{$set : {isAccepted : true}});
            const {acknowledged} = postUpdated;
            if(acknowledged){
                res.send({code : 201, msg : "Job accepted successfully"})
            }else{
                res.send({code : 401, msg: "Sorry.Something went wrong accepting job"})
            }
        }
    }

    
})



postRouter.post("/worker/get/listjobs",authToken,async(req,res)=>{
    const {workerId} = req.body;

    //Fetch for the skills of the 
    if(workerId){
        const worker = await User.find({_id : workerId})[0]
        const {isAWorker, isActive} = worker;
        if(isAWorker && isActive){
            // const listJobs = await ClientPost.find({location})

            // fetch list of post or jobs pertaining to worker location and skills
        }
    }
    

})




export {postRouter}