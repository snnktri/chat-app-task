export type LoggedUser = {
  _id: string;
  fullName: string;
  email: string;
  profile?:string;
  createdAt: string;
  updatedAt: string;
};

export type LoginResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    loggedUser: LoggedUser;
    accessToken: string;
  };
};

export interface ProtectedResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: LoggedUser
}

export interface AllUserRes {
  statusCode: number;
  success: boolean;
  message: string;
  data: LoggedUser[]
}
