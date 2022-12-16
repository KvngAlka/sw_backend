import Joi from 'joi'
import User from './models/User.js';


export const validateRegisteration = (data)=>{

    const schema = Joi.object({
        fullName : Joi.string().min(6).required(),
        age : Joi.string().max(2),
        gender : Joi.string(),
        ghanaCardNumber : Joi.string(),
        phoneNumber : Joi.string().min(10).max(10).required(),
        location : Joi.string().required(),
        password : Joi.string().min(6).required(),
        isAWorker : Joi.boolean().required()
    })

    let {error} = schema.validate(data);

    return {error}
}



export const userExists = async(phoneNumber)=>{
    let user = await User.find({phoneNumber});
    // const _user = await user
    return user[0];
}


export const isValidCredentials = async (phoneNumber,password)=>{
    let user = await User.find({phoneNumber,password});

    return user[0]
}

export const validateLogin = (data)=>{
    const schema = Joi.object({
        phoneNumber : Joi.string().min(10).max(10).required(),
        password : Joi.string().min(6).required()
    })

    let {error} = schema.validate(data);

    return {error}
}




export const validateClientPost = (data)=>{
    
    const schema = Joi.object({
        ownerId : Joi.string().required(),
        serviceId : Joi.string().required(),
        subServiceId : Joi.string().required(),
        location : Joi.string().required(),
    })

    let {error} = schema.validate(data);

    return {error}
}


export const validateUserEdit = (data)=>{

    const schema = Joi.object({
        _id : Joi.string(),
        fullName : Joi.string().min(6).required(),
        age : Joi.string().max(2),
        gender : Joi.string(),
        ghanaCardNumber : Joi.string(),
        phoneNumber : Joi.string().min(10).max(10).required(),
        location : Joi.string().required(),
        password : Joi.string().min(6).required(),
    })

    let {error} = schema.validate(data);

    return {error}
}