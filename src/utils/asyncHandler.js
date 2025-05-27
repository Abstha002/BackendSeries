

const asyncHandler=(requestHandler)=>{
    (request, resolve,next)=>{
        Promise.resolve(requestHandler(request,resolve,next)).catch((error)=next(error))
    }
}
export {asyncHandler}


// This is one way to make wrapper function and above shows another way to make the wrapper 
/*
const asyncHandler=(fun)=>async (req,res,next)=>{
    try {
        await fun(req,res,next)
    } catch (error) {
        res.status(error.code||500).json({
            success:true,
            message:error.message
        })
        
    }
}*/