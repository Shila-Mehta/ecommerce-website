import {Schema,model} from "mongoose";

const userSchema=new Schema({

    full_name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique: true,   
        required:true,
        lowercase:true,

    },
    password:{
        type:String,
        required:true,
        
    },
    role: {
    type: String,
    enum: ["admin", "customer"], // only these two roles allowed
    default: "customer"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }


    
})


const User= model("User",userSchema);

export  default User;