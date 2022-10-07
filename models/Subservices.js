import mongoose from "mongoose";

const schema = mongoose.Schema({
    parentCode: String,
    code : String,
    name : String,

})

export default mongoose.model("Subservices", schema)