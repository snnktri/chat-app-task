import { User } from "../models/user.model.js";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler  } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


interface AuthenticatedRequest extends Request {
    user?: InstanceType<typeof User>;
}

interface JwtPayload {
    _id: string;
    iat?:number;
    exp?:number;
}

export const verifyJWT = asyncHandler(
    async( req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const token = req.cookies?.accessToken ||
                    req.header("Authorization")?.replace('Bearer ', "");

         if(!token) {
                        throw new ApiError(401, "Unauthorized request.");
            }

         let decodedToken: JwtPayload;
        try {
                decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)as JwtPayload;
        } catch (error:any) {
        console.error("JWT verification failed.", error);
            throw new ApiError(401, error?.message||"Invalid access token.")
        }
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if(!user) {
            throw new ApiError(401, "Invalid access Token");
        }

        req.user = user;
        next();
    }
)