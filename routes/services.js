
import { Router } from "express";
import { authToken } from "./verifyToken.js";
import Services from '../models/Services.js'
import Subservices from '../models/Subservices.js'



const servicesRouter  = Router();



servicesRouter.get("/",authToken,async(req,res)=>{
    // const {code} = req.body;
    // if(!code) {
    //     res.send({code : 400, msg : "Code required"});
    //     return;
    // }

    const services = await Services.find()
    res.send({code : 200, data : services})

})

servicesRouter.post("/get/subservices",authToken,async(req,res)=>{
    const {code} = req.body;
    if(!code) {
        res.send({code : 400, msg : "Code required"});
        return;
    }

    const subServices = await Subservices.find({parentCode : code})

    res.send({code : 200, data : subServices})

})


servicesRouter.post("/service/search",authToken,async(req,res)=>{
    const {service} = req.body;
    if(!service) {
        res.send({code : 400, msg : "Name of Service required"});
        return;
    }

    const services = await Services.find()
    //code to filter services ----->  service.name contains service
    res.send({code : 200, data : services})

})


export {servicesRouter}