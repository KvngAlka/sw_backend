import { Router } from "express";
import { authToken } from "./verifyToken.js";

const notifyRouter = Router();


notifyRouter.post("/send/worker/job",authToken,(req,res)=>{
    const {workCategories} = req.body; //return list of worker skills
    

})



export default notifyRouter;