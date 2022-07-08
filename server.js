import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import routes from './routes.js'
import env from 'dotenv';

env.config();


//app config
let app = express();
let port  = process.env.PORT | 8088;


//Middlewares
app.use(express.json());
app.use(cors());
app.use("/api", routes);

//DB
let dbPassword =  process.env.ADMIN_PASSWORD;  //"adminpassword"
const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}
let dbUrl = `mongodb+srv://root:${dbPassword}@cluster0.gjhey.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(dbUrl,connectionParams)
.then( () => {
    console.log('Connected to the database ')
})
.catch( (err) => {
    console.error(`Error connecting to the database. n${err}`);
})


//Route
app.get('/', (req,res)=>{
    res.send("<h1>Welcome to Skilled Worker Backend<h1/>")
})


app.listen(port, ()=> console.log(`listening on localhost:${port}`))