import jwt from "jsonwebtoken";

const JWT_SECRET=process.env.JWT_SECRET || "dev_secret_change_me";


export function signToken(user){
    return jwt.sign({sub:user._id.toString(),role:user.role,name:user.full_name},JWT_SECRET,{expiresIn:"7d"});
}

export function verifyToken(token){
  return jwt.verify(token,JWT_SECRET);
} 



export function requireAuth(req,res,next){
    try{
        const header=req.headers.authorization || "";
        const [,token]=header.split(" ");
        if(!token) return res.status(401).json({message:"No token"});
        
        const payload=verifyToken(token);
        req.user={id:payload.sub,role:payload.role,name:payload.name};
        next();
    }
    catch(err){
        return res.status(401).json({message:"Invalid or expired token"});
    }
}

export function requireRole(role){
    return (req,res,next)=>{
        if(!req.user || req.user.role!==role){
            return res.status(403).json({message:"Forbidden"});
        }

        next();
    }
}