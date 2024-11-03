import { IChannelMember } from './channel.types';
import { IChat } from './chat.types';
import { IGroupMember } from './group.types';
import { IChatNotifications } from './notifications.types';

export interface IUser {
  id: number;
  username: string;
  avatar: string;
  lastOnline: Date;
  description: string;
  createdAt: any;
  name: string;
  isOnline: boolean;
  channelMembers?: IChannelMember[];
  personalChats?: IChat[];
  personalChats2?: IChat[];
  groupMembers?: IGroupMember[];
  PersonalChatNotification?: IChatNotifications[];
}

export interface IUserEdit {
  username?: string;
  name?: string;
  avatar?: string;
  description?: string;
}

export interface IUserEditFields {
  username?: string;
  name?: string;
  description?: string;
}

export interface IUpdateLastOnline {
  lastOnline: Date;
}

export interface UserState {
  user: IUser | null;
}
