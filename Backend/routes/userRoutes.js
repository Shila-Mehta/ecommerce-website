import express from "express";
import bcrypt  from "bcrypt";
const router=express.Router();
import User from "../models/userModel.js";


//CREATE
router.post("/", async(req, res) => {

  try{
     const {full_name,email,password,role} = req.body;

     const hashedPassword=await bcrypt.hash(password,10);

    const newUser=new User({
      full_name,
      email,
      password:hashedPassword,
      role:role ||"customer"
    })

    await  newUser.save();

  res.status(200).json({message: "User registered successfully", user: { full_name: newUser.full_name, email: newUser.email,role:role } // hide password
  });
  }
  catch(error){

   console.error(error);
    res.status(500).json({ message:"Signup error", error: error.message });
  }
   

});


//READ (Get all users)
router.get("/",async(req,res)=>{

    try{
     const users = await User.find().select("-password");
        res.json(users);

    }
    catch(error){
     res.status(500).json({error:error.message})
    }

})


//READ (Get one user by id)
router.get("/:id",async(req,res)=>{

    try{
       const user = await User.findById(req.params.id).select("-password");
        if(!user)  return res.status(404).json({error:"User not found "});
        res.json(user);

    }
    catch(error){
     res.status(500).json({error:error.message})
    }

})


//UPDATE (Update by id)
router.put("/:id",async(req,res)=>{
    try{

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    
    const user=await  User.findByIdAndUpdate(req.params.id,req.body,{new:true});
    if(!user) return res.status(404).json({error:"user not found"});
    res.json(user);
    }
    catch(error){
       res.status(400).json({error:error.message});
    }
})


//DELETE (Delete by id)
router.delete("/:id",async(req,res)=>{
    try{
    const user=await  User.findByIdAndDelete(req.params.id);
    if(!user) return res.status(404).json({error:"user not found"});
    res.json({message:"user deleted"});
    }
    catch(error){
       res.status(400).json({error:error.message});
    }
})


export  default router;