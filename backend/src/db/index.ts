import mongoose, { Mongoose} from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbName = "chat-app";


const createDb = async():Promise<void> => {
    try {
        const dbUrl:string = process.env.MONGO_URI!;

        const connectionInstance: Mongoose = await mongoose.connect(`${dbUrl}/${dbName}`);

        console.log("Cnnection is established to: ", connectionInstance.connection.host);

    } catch (error) {
        if(error instanceof Error) {
            console.log(error.message || "Error during db connection");
        }
        process.exit(1);
    }
}

export default createDb
