export interface Participant {
    _id: string;
    fullName: string;
    profile?: string;
}

export interface LastMessage {
    _id: string;
    senderId: Participant,
    message: string;
}

export interface Chat {
    _id: string;
    participants: Participant[],
    createdAt: Date;
    updatedAt: Date;
    lastMessage: LastMessage
}

export interface ChatResponse {
     statusCode: number;
      success: boolean;
      message: string;
      data: Chat[]
}

export interface Messages {
    _id: string;
    senderId: Participant,
    receiverId: string;
    message: string;
    isRead: boolean;
    chat: string;
    createdAt: string;
    updatedAt: string;
}

export interface Pagination {
    page: number;
    totalPages: number;
    totalMessages: number
}

export interface MessageByUser {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    chat: Chat;
    messages: Messages[];
    page: number;
    totalPages: number;
    totalMessages: number;
  };
}