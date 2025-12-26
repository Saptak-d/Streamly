import mongoose,{Schema} from "mongoose";


 const subscriptionSchema = new Schema({
        subscription : {
            type : Schema.Types.ObjectId,
            ref : "User"
        },
        channel : {
            type : Schema.Types.ObjectId,//like the user who subcribe to whome channel
            ref : "User"
        },


 },{timestamps : true})


 export const subscription = mongoose.model("subscription",subscriptionSchema )

 