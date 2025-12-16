import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";



export const connectDB = async()=>{
    try {
        console.log("ENV CHECK:", process.env.MONGODB_URI);

       const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log(`\n MonogoDB connected !! Db HOST ${connectionInstance.connection.host}`)

        
    } catch (error) {
        console.log("MongoDB connection Error ",error);
        process.exit(1)
    }
}

