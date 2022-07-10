import {Router} from 'express';
import { userExists, validateLogin, validateRegisteration } from '../validation.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js';



const authRouter = Router();


authRouter.post('/user/register',async(req,res)=>{
    const body = req.body;

    let {error}  = validateRegisteration(body)

    if(error) return res.send({code : 400,msg : error.details[0].message});
    
    if(body?.isAWorker){
        //check if Ghana Card Number provided
        let {ghanaCardNumber} = body;
        if(!ghanaCardNumber) return res.send({code : 400, msg : "Ghana Card Number Required for workers"});
    }

    const {phoneNumber} = body;
    const userAlreadyExist = await userExists(phoneNumber);
    if(userAlreadyExist.length !== 0) return res.send({code : 400, msg : "User already exists"});



    //hash password
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(body.password,salt);

    let user = new User({...body, password : hashedPassword, isActive : true, isOnline : true});
    let savedUSer = await user.save();

    res.json(savedUSer);

})



authRouter.post("/user/login",async(req,res)=>{
    const {body} = req;
    let {error} = validateLogin(body);
    if(error) return res.send({code : 400, msg : error.details[0].message});

    let {phoneNumber} = body;
    let user = await userExists(phoneNumber)

    console.log(user)
    if(!user) return res.send({code : 400, msg : "User does not exist"});

    let token = jwt.sign(body,process.env.TOKEN_SECRET);


    res.header("Authorization",token).send({
        code : 200,
        msg : "Login Successfull",
        data : {...user,token }
    })

})


export {authRouter}