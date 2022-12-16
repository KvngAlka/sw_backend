import mongoose from "mongoose";

const schema  = mongoose.Schema({
    ownerId : String,
    serviceId : String,
    subServiceId : String,
    isAccepted : Boolean
})


export default mongoose.model("ClientsPost", schema)