import mongoose from "mongoose";

const schema = mongoose.Schema({
    title : String,
    description : String,
    from : String,
    to : [
        {
            userId : String,
            read : Boolean
        }
    ] ,
    

})


export default mongoose.model("Notification", schema)