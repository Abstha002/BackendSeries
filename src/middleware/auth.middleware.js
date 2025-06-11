import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/users.models.js";

export const verifyJWT=asyncHandler(async(req,res,next)=>{
    try {
   
        
        const token=req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","")
        console.log(token)
        if (!token) {
            throw new ApiError(400," unauthorized request")
        }
    
        const decodedToken=await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken").lean()
        if (!user) {
            throw new ApiError(400,"Invalid ")
        }
        req.user=user;
        next();
    } catch (error) {
        throw new ApiError(401,error?.message||"Invalid Access token");
    }
})