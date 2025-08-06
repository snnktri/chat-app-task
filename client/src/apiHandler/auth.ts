import { api } from "@/utils/axiosIntance";
import type { LoginInput, RegisterInput } from "@/lib/user/userValidator";
import type { AllUserRes,LoginResponse, ProtectedResponse } from "@/types/user.type";

export const registerUser = async (data: RegisterInput): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.profile && data.profile instanceof File) {
      formData.append("profile", data.profile);
    }

    console.log(formData);
       const res = await api.post("/user/register", formData);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error?.message || "Error during registering the user.");
    }
    throw error;
  }
};

export const login = async (data: LoginInput): Promise<LoginResponse> => {
  try {
    const res = await api.post<LoginResponse>("/user/login", data);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error?.message || "Error during login.");
    }
    throw error;
  }
};
export const protectedUser = async (): Promise<
  ProtectedResponse | undefined
> => {
  try {
    const token = localStorage.getItem("cToken");

    if (!token) {
     // console.log("Token not found.");
      return;
    }

    const res = await api.get<ProtectedResponse>("/user/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message || "Error fetching protected user.");
    }
    throw error;
  }
};


export const getAllUser = async (): Promise<AllUserRes | undefined> => {
  try {
     const token = localStorage.getItem("cToken");

    if (!token) {
     // console.log("Token not found.");
      return;
    }
    const res =await api.get<AllUserRes>("/user/getAll", {
      headers: {
         Authorization: `Bearer ${token}`,
      }
    });

    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export const getUserById = async(id: string): Promise<ProtectedResponse | undefined>=> {
   try {
     const token = localStorage.getItem("cToken");

    if (!token) {
     
      return;
    }
    const res =await api.get<ProtectedResponse>(`/user/byId/${id}`, {
      headers: {
         Authorization: `Bearer ${token}`,
      }
    });

    return res.data;
  } catch (error) {
    console.error(error);
  }
}