import { api } from "@/utils/axiosIntance";

export const sendMessage = async (data: {message: string, receiverId: string}): Promise<any> => {
    try {
        const token = localStorage.getItem("cToken");
        if(!token) {
            return null;
        }
        const res = await api.post(`/message/send`, data,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return res.data;
    } catch (error) {
        console.log(error);
    }
}