import { IGroup } from './group.types';
import {
  IAttachment,
  IMessageChannel,
  IMessageReadChannel
} from './message.types';
import { IChannelNotifications } from './notifications.types';
import { IUser } from './user.types';

export interface IChannel {
  id?: number;
  name: string;
  description: string;
  avatar: string;
  members?: IChannelMember[];
  roles?: IChannelRole[];
  messages?: IMessageChannel[] | null;
  media?: IAttachment[] | null;
  private: boolean;
  groupId?: number;
  MessageReadChannel?: IMessageReadChannel[] | null;
  ChannelNotification?: IChannelNotifications[];
  type?: 'channel' | 'chat' | 'group';
  count?: number;
  qtyUsers: number;
  isMuted?: boolean;
  discussion: IGroup;
}
export interface IChannelEdit {
  name: string;
  description: string;
  avatar: string;
  private?: boolean;
  channelId: number;
}

interface baseSet {
  userId: number;
  channelId: number;
}

export interface IChannelMember {
  userId: number;
  channelId: number;
  channelRoleId: number;
  isMuted: boolean;
  ChannelNotification?: IChannelNotifications[];
  channel: IChannel;
  channelRole: IChannelRole;
  id?: number;
  user:IUser,

}

export interface IAddMember extends baseSet {}

export interface IDeleteMember extends baseSet {}

export interface IChannelRole {
  name: string;
  channelId?: number;
  permissions: any[];
  color?: string;
  id?:number,
  isSystemRole:boolean
}

export interface IRemoveRole extends baseSet {}

export interface IAssignRole extends baseSet {
  roleName: string;
}

export interface IEditRole {
  newRoleName: string;
  roleName: string;
  newPermissions: string[];
  channelId: number;
  color:string
}

export interface IDeleteRole {
  roleName: string;
  channelId: number;
}

export interface IChangeNotifications {
  isMuted: boolean;
  channelId: number;
}

export interface IChannelForm {
  name: string;
  description: string;
  avatar?: string;
  private: boolean;
}

export interface IPermission {
  id:number,
  action:permissionsVariant,
  description:string
}
enum permissionsVariant {
  delete = 'delete',//high
  edit = 'edit', //middle
  addMember = 'addMember',//base
  removeMember = 'removeMember',//high
  sendMessage = 'sendMessage', //base
  addMedia = 'addMedia', //base
  changeRole = 'changeRole',//high
  seeUsers = 'seeUsers',//base
  changeDiscussion = 'changeDiscussion',//middle
}
