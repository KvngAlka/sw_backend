import { Router } from "express";
import { authToken } from "./verifyToken";

const notifyRouter = Router();


notifyRouter.post("/send/worker/job",authToken,(req,res)=>{
    const {workCategory} = req.body;
})



export default notifyRouter;