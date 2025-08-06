
import type { ChatResponse, MessageByUser } from "@/types/chat.type";
import { api } from "@/utils/axiosIntance";

const TOKEN = localStorage.getItem("cToken");


export const createChat = async(id: string): Promise<any> => {
    try {
        const res = await api.post('/chat/create', {userId: id},{
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            }
        })
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const getAllChat = async(): Promise<ChatResponse> => {
    try {
        const res = await api.get('/chat/getAll', {
    headers: {
        'Authorization': `Bearer ${TOKEN}`
    }
});

return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getChatById = async(id: string): Promise<MessageByUser> => {
    try {
        const res = await api.get(`/chat/getOne/${id}`,{
            headers: {
                 'Authorization': `Bearer ${TOKEN}`
            }
        });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}