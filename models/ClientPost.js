import mongoose from "mongoose";

const schema  = mongoose.Schema({
    ownerId : String,
    serviceId : String,
    subServiceId : String,
    isAccepted : Boolean,
    acceptedBy : String
})


export default mongoose.model("ClientsPost", schema)