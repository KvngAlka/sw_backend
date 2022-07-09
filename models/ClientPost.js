import mongoose from "mongoose";




const schema  = mongoose.Schema({
    ownerId : String,
    title : String,
    description : String,
    location : String,
    workCategory : String,
    isAccepted : Boolean
})


export default mongoose.model("ClientsPost", schema)