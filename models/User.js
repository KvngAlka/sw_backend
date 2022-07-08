import mongoose from "mongoose";

let schema  = mongoose.Schema({
    fullName : String,
    age : String,
    phoneNumber : Number,
    gender : String,
    location : String,
    ghanaCardNumber : String,
    password : String,
    isAWorker : Boolean

});


export default mongoose.model("User", schema);

