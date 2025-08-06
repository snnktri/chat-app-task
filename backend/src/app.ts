import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

console.log("hello i am shankar khatri.")

app.use(cors());

app.use(express.json());
app.use(express.urlencoded( {extended: true}));

app.use(express.static("public"));

app.use(cookieParser());

// user route
import UserRoute from "./routes/user.route.js"
// chat route
import ChatRoute from "./routes/chat.route.js";
// messaage route
import MessageRoute from "./routes/message.route.js";

app.use("/api/user", UserRoute);
app.use("/api/chat", ChatRoute);
app.use("/api/message", MessageRoute);

export  { app };