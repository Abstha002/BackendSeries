import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  jwt  from "jsonwebtoken";


const generateAccessAndRefreshToken=async(userId)=>{
    try{
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken;
        await user.save({ValidateBeforeSave:false})

        return {accessToken,refreshToken};


    }
    catch(error){
        throw new ApiError(500,  "generatetoken  "+error.message,)
    }
}

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

    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        // Clean up uploaded files if user already exists
        const avatarLocalPath = req.files?.avatar?.[0]?.path;
        const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
        const fs = await import('fs');
        if (avatarLocalPath && fs.existsSync(avatarLocalPath)) {
            fs.unlinkSync(avatarLocalPath);
        }
        if (coverImageLocalPath && fs.existsSync(coverImageLocalPath)) {
            fs.unlinkSync(coverImageLocalPath);
        }
        throw new ApiError(400,"User already exists")
    }


    //avator first property return 
    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;


    if(!avatarLocalPath){
        console.log(avatarLocalPath);
        throw new ApiError(400,"Avator is required");
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        console.log(avatar);
        throw new ApiError(400,"Avatar is requiredd");
    }

   const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url,
        email,
        password,
        username:username.toLowerCase()
    })

    // Await the query to get a plain JS object
    const createdUser = await User.findById(user._id).select("-password -refreshToken").lean();
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

const loginUser=asyncHandler(async(req,res)=>{
    //todos
    //get user,email, password
    //mongoose find one 
    //set refreshToken,accessToken

    const {username,password,email}=req.body;
    console.log(email,password,username)
    if(!username && !email){
        throw new ApiError(400,"Username or password is required")
    }
    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })
    if(!existedUser){
        throw new ApiError(404,"User doesn't exist");
    }
    const isPasswordValid=await existedUser.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"password is not correct")
    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(existedUser._id);

    const loggedInUser=await User.findById(existedUser._id).select("-password -refreshToken").lean();

    const options={
        httpOnly:true,
        secure:false
    }
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,{
                user:loggedInUser,accessToken,refreshToken
            },
            "user logged in Successfully"
            
        )
)
})

const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                refreshToken:undefined,
            },
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:false
    }
    res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(
            200,
            {},
            "user logged out"
        )
    )
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookie.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(
            401,"unauthorized Request"
        )
    }
   try {
     const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
     const user=await User.findById(decodedToken?._id)
     if(!user){
         throw new ApiError(
             401,"Invalid token"
         )
     }
     if (incomingRefreshToken!==user.refreshToken) {
         throw new ApiError(401,"Expird token or already in use")
     }
     const options={
         httpOnly:true,
         secure:false
     }
     const {accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id)
     return res.status(200)
     .cookie("refreshToken",refreshToken,options)
     .cookie("accessToken",accessToken,options)
     .json(new ApiResponse(
         200,
         {accessToken,refreshToken},
         "successly created refresh token"
     ))
   } catch (error) {
        throw new ApiError(401,error?.message||"decoding failed")
   }
})

const updatedPassword=asyncHandler(async(req,res)=>{
    
})
export {registerUser,loginUser,logoutUser,refreshAccessToken} ;