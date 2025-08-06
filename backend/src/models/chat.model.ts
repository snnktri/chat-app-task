import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
    participants: Schema.Types.ObjectId[],
    lastMessage: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const chatSchema = new Schema<IChat>({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
    ],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message"
    }
},
{
    timestamps: true
});


export const Chat = mongoose.model<IChat>("Chat", chatSchema);
