import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    refreshToken?: string;
  };
}

export const createChat = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    console.log("i reach here")
    const { userId } = req.body;

    console.log("User id:", userId)

    const user = req.user;

    if (!user || !user._id) {
      throw new ApiError(403, "Sender is required.");
    }

    const chatExist = await Chat.findOne({
      participants: {
        $all: [user._id, userId],
      },
    });

    if (chatExist) {
      throw new ApiError(402, "Chat already exist.");
    }

    const newChat = await Chat.create({
      participants: [user._id, userId],
    });

    return res
      .status(200)
      .json(new ApiResponse(200, newChat, "Chat created successfully."));
  }
);

// export const boilderPlate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
//     const
// })

export const getAllChat = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;

    if (!user || !user._id) {
      throw new ApiError(403, "User id is required to retrieve the chat");
    }

    

    const allChat = await Chat.find({ participants: user._id })
      .populate({
        path: "participants",
        select: "fullName profile",
        model: "User"
      })
      .populate({
        path: "lastMessage",
        select: "message image senderId",
        model: "Message",
        populate: ({
          path: "senderId",
          select: "fullName profile",
          model: "User"
        })
      })
      .sort({updatedAt: -1}).lean();
     const rawChats = await Chat.find({ participants: user._id }).sort({ updatedAt: -1 });
console.log(rawChats);


    return res
      .status(200)
      .json(
        new ApiResponse(200, allChat, "Chats is retrieve is successfully.")
      );
  }
);

export const getChatById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user?._id;

    const chatId = req.params.id;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    if (!chatId) {
      throw new ApiError(403, "User id is requied to retrive chat by id");
    }

    const userExist = await User.findById(user);

    if (!userExist) {
      throw new ApiError(404, "User not found by the given id.");
    }

   const chat = await Chat.findById(chatId)
      .populate("participants", "fullName profile")
      .lean();

       const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("senderId", "fullName profile")
      .lean();

      const totalMessages = await Message.countDocuments({ chat: chatId });

    return res
      .status(200)
      .json(new ApiResponse(200,  {
        chat,
        messages,
        page,
        totalPages: Math.ceil(totalMessages / limit),
        totalMessages,
      }, "Chat retrieved successfully."));
  }
);
