
const  asyncHandler = (requestHandler)=>{
   return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).
        catch((err)=>next(err))
    }
}

export {asyncHandler}



//const asyncHandler  = () => {}
//const asyncHandler = (func) => () => {}
// const asyncHandler = (fnc) => async () => {}

//  const asyncHandler = (fnc) => async () => {
    

//    try {

//     await fnc(req,res,next)
    
//    } catch (error) {
//       res.status(err.code || 500).json({
//         success : false,
//         message : err.message
//       })
//    }





