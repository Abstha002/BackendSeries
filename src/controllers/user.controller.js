import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";




const registerUser= asyncHandler(async (req,res)=>{
    // res.status(200).json({
    //     message:"ok"
    // })

    //step involved in registeration of the video
    //gets details from the frontend 
    //validation of the detail
    //check if user exits
    //check for the reqd file
    //upload cloudinary
    //get link 
    //create db user
    //remove password and response 


    const {fullname,email,username,password}=req.body;
    console.log(fullname,email,username,password);
    
    if([fullname,email,username,password].some((field)=>field.trim()==="")){
        throw new ApiError(400,"all fields are required")
    }

    const existedUser=User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(400,"User already exists")
    }

    //avator first property return 
    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avator is required");
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar is required");
    }

   const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url,
        email,
        password,
        username:username.toLowerCase()

    })

    const createdUser=User.findById(user._id).select("-password -refreshToken");
    if(!createdUser){
        throw new ApiError(500, "something went wrong while register the user");
    }

    return res.status(200).json(
        new ApiResponse({
          statusCode:200,
          data:createdUser,
          message:"Data received"  
        })
    )
})


export default registerUser;