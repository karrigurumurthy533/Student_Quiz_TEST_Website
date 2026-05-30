import app from './app.js';
import dotenv from "dotenv";
import { connectMongoDatabase } from './config/db.js';

dotenv.config();
connectMongoDatabase();


//🥵Handle Uncaught Exceptions errors
process.on('uncaughtException',(err)=>{
    console.log(`Error:${err.message}`);
    console.log("server is shutting down,due to unCaughtExceptions errors");
    process.exit(1);
})

const PORT=process.env.PORT||3000;

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is running on PORT ${process.env.PORT}`);
})

//😈Promise Db Error handle rejections
process.on('unhandledRejection',(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`server is shutting down,due to unhandled promise rejection`);
    server.close(()=>{
        process.exit(1)
})
})