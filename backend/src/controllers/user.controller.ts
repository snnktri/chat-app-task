import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadeCloudinary } from "../utils/cloudinary.js";
import type { CookieOptions } from "express";
import type { Request, Response } from "express";
import { Chat } from "../models/chat.model.js";

interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
        refreshToken?: string;
    }
}

const generateAccessRefreshToken = async(userId:string):Promise<{
    accessToken:string;
    refreshToken:string;
}>=> {
    try {
        const user = await User.findById(userId);
        if(!user) {
            throw new ApiError(400, "user does not exist by id.");
        }

        const accessToken:string = user.generateAccessToken();
        //console.log("accessToken", accessToken);
       
        const refreshToken:string = user.generateRefreshToken();
         //console.log("Refresh token", refreshToken)

        user.refreshToken = refreshToken;
        await user.save({
            validateBeforeSave: false
        });

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "could not generate token");
    }
}


const registerUser  = asyncHandler(async(req: Request, res: Response) => {
    console.log("error happend.");
    console.log(req.body);
    const { fullName, email, password} = req.body;
    if([fullName, email, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "Please provide all required fields.");
    }

    console.log("nkjnlkj")

    const profileLocalPath = req.file?.path;

    let profileUrl;

    if(profileLocalPath) profileUrl = await uploadeCloudinary(profileLocalPath as string);

    //console.log(profileUrl);

    const user = await User.findOne({
        email:email
    });

    if(user) {
        throw new ApiError(400, "user already exist.");
    }

    const createUser = await User.create({
        email:email,
        fullName,
        password,
        profile:profileUrl?.url
    })

    if(!createUser) {
        throw new ApiError(401, "user not created.");
    }

    const createdUser = await User.findById(createUser._id).select("-password -refreshToken");

    if(!createdUser) {
        throw new ApiError(500, "usrr not regiseter.");
    }
    res.status(201)
    .json(
        new ApiResponse(200, createdUser, "User created sussessfully.")
    );
});
 
const loginUser = asyncHandler(async(req: Request, res: Response) => {
    const { email, password } = req.body;

    if(!email || !password) {
        throw new ApiError(401, "email and password required");
    }

    const user = await User.findOne({email});

    if(!user) {
        throw new ApiError(404, "User not found");
    }

    const isMatch:boolean = await user.isPasswordCorrect(password as string);


    if(!isMatch) {
        throw new ApiError(403, "Password invlid")
    }


    const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id as string);

    const loggedUser = await User.findById(user._id as string).select("-password -refreshToken");

    if(!loggedUser) {
        throw new ApiError(500, "User is not logged due to internal error.");
    }

    const options: CookieOptions = {
        // httpOnly: true,
        secure: true
    }

    console.log("User", loggedUser)

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {loggedUser, accessToken}, "user loggin successfully")
        );
});

const logoutUser = asyncHandler(async(req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    if(!user || !user._id) {
        throw new ApiError(401, "Unauthorized access.");
    }

   await User.findByIdAndUpdate(user._id,
    {
        $unset: {
            refreshToken: undefined,
        },
             
    },
    {
        new: true,
    });
   
    const options: CookieOptions = {
        // httpOnly: true,
        secure: true
    }

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200,{}, "Logout user successfully.")
        );


});

const protectedUser = asyncHandler(async(req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;

    if(!userId) {
        throw new ApiError(401, "User should be logged in.");
    } 

    const loggedUser = await User.findById(userId).select("-password -refreshToken");

   // console.log(loggedUser)

    if(!loggedUser) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(
        new ApiResponse(200, loggedUser, "User is logged in.")
    );
})

const getAllUser = asyncHandler( async (req: AuthenticatedRequest, res: Response) => {

    const userId = req.user?._id;

    if(!userId) {
        throw new ApiError(403, "Error happened.");
    }

    const chats = await Chat.find({
        participants: userId
    });
     const connectedUserIds = new Set<string>();

      chats.forEach(chat => {
        chat.participants.forEach((id: any) => {
            if (id.toString() !== userId.toString()) {
                connectedUserIds.add(id.toString());
            }
        });
    });
    const users = await User.find({
    _id: {
        $ne: userId,
        $nin: Array.from(connectedUserIds)
    }
}).select("-password -refreshToken");
    return res.status(200).json(
        new ApiResponse(200, users, "users retrieve successfully.")
    );
})

const userById= asyncHandler(async(req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;

    if(!userId) {
        throw new ApiError(401, "User should be logged in.");
    } 

    const id = req.params.id;

    const user = await User.findById(id).select("-password -refreshToken");
    res.status(200).json(
        new ApiResponse(200, user, "User is logged in.")
    );
})

export { registerUser, loginUser, logoutUser, protectedUser, getAllUser, userById };