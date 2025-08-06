import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadeCloudinary } from "../utils/cloudinary.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { io, getReceiverId } from "../socket.js";

interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
        refreshToken?: string;
    }
}

export const sendMessage = asyncHandler( async ( req: AuthenticatedRequest, res: Response ) => {
    const { message, receiverId } = req.body;

    const user = req.user;
   

    if(!receiverId) {
        throw new ApiError(403, "receiver id is required to send the message.");
    }

    if(!user || !user._id) {
        throw new ApiError(403, "Sender id is required");
    }

   const chat = await Chat.findOne({
    participants: { $all: [user._id, receiverId] }
});

//console.log(chat)

    if(!chat) {
        throw new ApiError(404, "Chat not found");
    }

    const createMessage = await Message.create({
        senderId: user._id,
        chat: chat._id,
        message: message ? message : "",
        isRead: false,
        receiverId: receiverId
    });

    const messageS = await Message.findById(createMessage._id).populate("senderId", "fullName profile");

    await Chat.findByIdAndUpdate(chat._id, {
        lastMessage: createMessage?._id
    });

    const receiverSocketId = getReceiverId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", {
      ...createMessage.toObject(),
      chatId: chat._id,
    });
  }

  const senderSocketId = getReceiverId(user._id.toString());
  if (senderSocketId) {
    io.to(senderSocketId).emit("messageSent", {
      ...createMessage.toObject(),
      chatId: chat._id,
    });
  }

    return res.status(200)
        .json(
            new ApiResponse(200, messageS, "Message send successfully.")
        );
});

export const chageStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
     const chatId = req.params.id;
     const currentUserId = req.user?._id;

   //  console.log("chat id:",chatId);

     if(!chatId) {
        throw new ApiError(403, "Chat is not selected.");
     }

     const updated = await Message.updateMany(
      {
        chat: chatId,
        receiverId: currentUserId,
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

     res.status(200).json(
        new ApiResponse(200, {modified: updated.modifiedCount}, "Message is seen.")
     );
})