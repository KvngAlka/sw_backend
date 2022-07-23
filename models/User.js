import mongoose from "mongoose";

let schema  = mongoose.Schema({
    fullName : {
        type : String,
        required : true,
    },
    age : String,
    phoneNumber : {
        type : String,
        required : true,
        min : 10,
        max : 10
    },
    gender : String,
    location : String,
    ghanaCardNumber : String,
    password : {
        type : String,
        min : 6
    },
    date : {
        type : Date,
        default : Date.now
    },
    skills : [String],
    isAWorker : Boolean,
    isActive : Boolean,
    isOnline : Boolean

});


export default mongoose.model("User", schema);

