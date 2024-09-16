import mongoose from "mongoose";

const DB_connection=async()=>{
    const uri=process.env.DB_CONNECTION_STRING
   await mongoose.connect(uri,
   
    ).then(()=>{
        console.log("server connected to mongo db");

    }).catch(err=>{

        console.log(err);
    })
}

export default DB_connection