import mongoose, { mongo } from "mongoose";

const DB_connection=async()=>{
    const uri=process.env.DB_CONNECTION_STRING
   await mongoose.connect(uri,
   
    ).then(()=>{
        console.log("server connected to mongo db");

    }).catch(err=>{

        console.log(err);
    })
}

export const selfPro_DB_conn=async()=>{
try {    
const conn= mongoose.createConnection(process.env.DB_CONNECTION_selfpro)
return conn
} catch (error) {
    console.log(error,process.env.DB_CONNECTION_selfpro);
    
    return false
}
}
export default DB_connection
