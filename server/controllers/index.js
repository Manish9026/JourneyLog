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

const  isNotEmpty=(value)=> {
    if (value == 'null' || value == 'undefined') {
      return false;
    }
    if (value === null || value == undefined) {
        return false;
      }
  
    if (typeof value === 'string') {
      return value.trim() !== '';
    }
  
    if (Array.isArray(value)) {
      return value.length > 0;
    }
  
    if (typeof value === 'object') {
      return Object.keys(value).length > 0;
    }
  
    return true; // For other data types, assume non-empty if not null/undefined
  }

 export {badRes,goodRes,isNotEmpty}