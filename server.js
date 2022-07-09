import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import routes from './routes/routes.js'
import { authRouter } from './routes/auth.js'
import env from 'dotenv';

import path from 'path'

env.config();


//app config
let app = express();
let port  = process.env.PORT || 3088;


//DB
let dbPassword =  process.env.ADMIN_PASSWORD;  //"adminpassword"
const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}

let dbUrl = process.env.DB_URL;








// CONNECT TO DATABASE
mongoose.connect(dbUrl,connectionParams)
.then( () => {
    console.log('Connected to the database ');

    //Middlewares
    app.use(express.json());
    app.use(cors());
    app.use("/api", routes);
    app.use('/api/auth',authRouter )


    //Index Route
    app.get('/', (req,res)=>{

        if(req.accepts('html')){
            let welcomeFilePath = path.join(process.cwd() + "/templates/Welcome.html");
            res.sendFile(welcomeFilePath);
        }else if(req.accepts('json')){
            res.send({welcome : "Welocme to Skilled Workers API"})
        }else{
            res.send("Welcome to Skilled Workers API")
        }
        
    })


    app.listen(port, ()=> console.log(`listening on localhost:${port}`));
})
.catch( (err) => {
    console.error(`Error connecting to the database. \n${err}`);
})







//test here...


// app.use(express.json());
// app.use(cors());


// app.get('/', (req,res)=>{

//     if(req.accepts('html')){
//         let welcomeFilePath = path.join(process.cwd() + "/templates/Welcome.html");
//         res.sendFile(welcomeFilePath);
//     }else if(req.accepts('json')){
//         res.send({welcome : "Welocme to Skilled Workers API"})
//     }else{
//         res.send("Welcome to Skilled Workers API")
//     }
    
// })


// app.listen(port, ()=> console.log(`listening on localhost:${port}`));

