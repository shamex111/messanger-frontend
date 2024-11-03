import { IAttachment, IMessageChat, IMessageReadUser } from "./message.types";
import { IUser } from "./user.types";

export interface IChat {
  id?: number;
  user1Id: number;
  user2Id: number;
  messages?: IMessageChat[] | null;
  media?: IAttachment[] | null;
  messageReadUser?: IMessageReadUser[] | null;
  type?: "channel" | "chat" | "group";
  count?: number;
  user1:IUser;
  user2:IUser;

}

export interface IChatForm {
  user1Id: number;
  user2Id: number;
}
