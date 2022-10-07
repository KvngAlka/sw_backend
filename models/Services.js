
import mongoose from "mongoose";

const schema = mongoose.Schema({
    code: String,
    description : String,
    name : String,
    imgUrl : String

})

export default mongoose.model("Services", schema)