const badRes=({message,statusCode,data,error,status,res}={})=>{
    return res.status(statusCode || 201).json({
        message:message || "try after some time",
        data:data || null,
        error:error || null,
        status:false,     
    })
}
const goodRes=({message,statusCode,data,status,res}={})=>{
    return res.status(statusCode || 201).json({
        message:message || "success",
        data:data || null,
        status:true,     
    })
}

 export {badRes,goodRes}