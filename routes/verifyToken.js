import  jwt from "jsonwebtoken";



export function authToken(req,res,next){
    let token = req.header("Authorization");
    if(!token) return res.status(401).send("Access Denied");

    //split Bearer from token
    token = token && token.split(" ")[1];
    
    try{
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user = verified;
        next();

    }catch(err){
        res.status(400).send("Invalid Token")
    }
}