
import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
    senderId: Schema.Types.ObjectId;
    receiverId: Schema.Types.ObjectId;
    message?: string;
    chat: Schema.Types.ObjectId;
    isRead: boolean;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage> ({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required:false
    },
    isRead: {
        type: Boolean,
        default: false
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    }

},
{
    timestamps: true
});

export const Message = mongoose.model<IMessage>("Message", messageSchema);