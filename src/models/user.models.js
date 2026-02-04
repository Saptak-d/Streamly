import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from "crypto"
const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique: true ,
            lowercase :true,
            trim: true,
            index: true,
        },
        email :{
            type : String,
            required : true ,
            unique : true ,
            lowercase : true ,
            trim : true
        },
        fullName : {
            type : String ,
            required : true ,
             trim : true ,
            index : true,
        },
        avatar: {
            url :{
                type : String,
                required : true
            },
            public_id :{
                type : String,
                required : true
            }
        },
        coverImage : {
          url :{
                type : String,
               
            },
            public_id :{
                type : String,
              
            }
        },
        watchHistory : [
            {
                type : Schema.Types.ObjectId,
                ref : "Video"
            }
        ],
        password : {
            type : String,
            required : [true ,'Password is required']
        },
        refreshToken: {
            type: String,
        },
        forgotpasswordToken : {
            type : String,
        },
        forgotpasswordExpiry : {
            type : Date
        }


}
,{timestamps:true})

userSchema.pre("save", async function(){

    if(!this.isModified("password"))  return;

    this.password = await bcrypt.hash(this.password , 10)
    return;
})

userSchema.methods.isPasswordCorrect = async function(password) {
    
   return await bcrypt.compare(password, this.password )
}
userSchema.methods.generateAccessToken =  function(){
   return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username : this.username,
            fullName : this.fullName,
        },
        process.env.ACCCESS_TOKEN_SECRECT,

        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefershToken = function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRECT,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
},
 userSchema.methods.generateTemporatryToken =  function(){
//this function is retun 2 type of token 1 is hash and another is unhased token coz we want to store the hased token in DB and retun unhased token in client side 
 
  const unhashedToken = crypto.randomBytes(20).toString("hex")
  const hashedToken =  crypto.createHash("sha256").update(unhashedToken).digest("hex");

  const tokenExpiry = Date.now() + (2 * 60 * 1000);

  return {hashedToken , unhashedToken , tokenExpiry};

 }

export const User = mongoose.model("User", userSchema)