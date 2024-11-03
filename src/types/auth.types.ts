import { IUser } from "./user.types";

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResponse extends ITokens {
  user: IUser;
}

export interface IAuthForm {
  username:string,
  password:string
}