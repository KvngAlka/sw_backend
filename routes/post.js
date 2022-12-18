import { Router } from "express";
import { authToken } from "./verifyToken.js";
import ClientPost from "../models/ClientPost.js";
import { userExists, validateClientPost } from "../validation.js";
import User from "../models/User.js";
import Services from "../models/Services.js";
import Subservices from "../models/Subservices.js";
import { convertService, getUserById } from "../funtions.js";


const postRouter  = Router();



postRouter.post("/add",authToken,async(req,res)=>{
    let {body} = req;
    body = {...body, location : "Universtity of Cape Coast"}
    const {error} = validateClientPost(body);
    if(error) return res.status(400).send(error.details[0].message)

    const post = new ClientPost({...body, isAccepted : false});
    const savedPost = await post.save();

    if(true){
        //send notification to workers

        const availableWorkers = await User.updateMany(
            {
                isAWorker : true, isActive : true,
                skills : {
                    serviceId : savedPost.serviceId,
                    subServiceId : savedPost.subServiceId
                }
            }
                , 
            {
                $push : { notifications :  savedPost }
            }
        )

        availableWorkers
        
    }

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


postRouter.post("/delete",authToken ,async(req,res)=>{

    const {body} = req;

    if(!body._id)return res.send({code: 400, msg:"Id of post required"});

    const post = await ClientPost.find({_id : body._id}); //res => POST[]


    if(post[0]){
        //CHECK IF IT'S BEING DELETED BY THE OWNER
        const isOwner = post[0].ownerId === body.ownerId;

        if(isOwner){
            const {acknowledged} = await ClientPost.remove({_id : body.id})
            if(acknowledged){
                res.send({code : 201, msg : "Deleted Successfully"})
            }
            
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
        const newPosts =  await Promise.all(
            posts.map(async(post) =>{

                const {serviceId, subServiceId, ownerId} = post
                const services = await Services.find({code : serviceId});
                const subServices = await Subservices.find({parentCode : serviceId, code : subServiceId})

                const service = services[0]?._doc;
                const subService = subServices[0]?._doc;
                const serviceName = service?.name;
                const client = await getUserById(ownerId)
    
    
                return {
                    ...post._doc,
                    ...service,
                    ...subService,
                    serviceName,
                    location : client.location
                    
                }
    
            })

        ) 
        
        res.send({code : 201, data : newPosts})
    }else{
        res.send({code : 400, msg : "UnAuthorized"})
    }

})



//FOR WORKERS


postRouter.post("/worker/get/notifications", authToken, async(req,res)=>{
    const {workerId} = req.body;

    const posts = await ClientPost.find();
    const workerDetails = await User.find({_id : workerId});

    function containsObject(obj, list) {
        var i;
        let found = false;

        for (i = 0; i < list.length; i++) {

            
            if (!found && JSON.stringify(list[i]) === JSON.stringify(obj) ){
                found =  true;
            }
        }
    
        return found;
    }

    if(workerDetails[0].skills){
        const skills = workerDetails[0].skills
        const newSkills = skills.map(skill => ({serviceId : skill.serviceId, subServiceId : skill.subServiceId}))


        const postsToSend = posts.filter(
            post => (
                
                !post.isAccepted &&
                containsObject({serviceId : post.serviceId, subServiceId : post.subServiceId}, newSkills)
            )
        )

        const newPostsToSend =  await convertService(postsToSend);

        res.send({code : 201, data : newPostsToSend})
    }

    
})





postRouter.post("/worker/accept/post", authToken, async(req,res)=>{
    const {postId, workerId} = req.body;

    //check if post has not been already accepted
    let post = await ClientPost.find({_id : postId});
    post  = post[0];

    if(post){
        if(post.isAccepted) return res.send({code : 400, msg : "Job is already taken by another worker."});

        else {
            const postUpdated = await ClientPost.updateOne({_id : postId },{$set : {isAccepted : true, acceptedBy : workerId}});
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
        const worker = await User.find({_id : workerId})


        if(!worker[0]) return res.send({code : 401, msg : "Worker does not exist"})
        
        const {isAWorker, isActive, _id} = worker[0];
        if(isAWorker && isActive){

            const listJobs = await ClientPost.find({acceptedBy : workerId})
            const newListJobs = await convertService(listJobs);

            res.send({code : 200, msg : newListJobs})
        }else{

            res.send({code : 401, msg : "You need to be an active worker"})
        }
    }else{
        res.send("Worker Id required")
    }
    

})




export {postRouter}