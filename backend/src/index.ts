
import CreateDB from "./db/index.js"
import dotenv from "dotenv";
import { httpServer } from "./socket.js";


dotenv.config({
    path: './.env',
});

const PORT = process.env.PORT || 8090;

CreateDB().then(() => {
    httpServer.listen(PORT, () => {
        console.log("server listening at:", PORT)
    })
}).catch((error : any) => {
    console.log(error.message || "Mongodb connection failed.")
})