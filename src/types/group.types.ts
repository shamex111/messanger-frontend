import { IAttachment, IMessageGroup, IMessageReadGroup } from './message.types';
import { IGroupNotifications } from './notifications.types';
import { IUser } from './user.types';

export interface IGroup {
  id?: number;
  name: string;
  description: string;
  avatar: string;
  members?: IGroupMember[];
  roles?: IGroupRole[];
  messages?: IMessageGroup[] | null;
  media?: IAttachment[] | null;
  private: boolean;
  groupId?: number;
  MessageReadGroup?: IMessageReadGroup[] | null;
  GroupNotification?: IGroupNotifications[];
  type?: 'channel' | 'chat' | 'group';
  count?: number;
  qtyUsers: number;
  isMuted?: boolean;
}
export interface IGroupEdit {
  name: string;
  description: string;
  avatar: string;
  private: boolean;
}

interface baseSet {
  userId: number;
  groupId: number;
}

export interface IGroupMember {
  userId: number;
  groupId: number;
  groupRoleId: number;
  isMuted: boolean;
  groupRole: IGroupRole;
  GroupNotification?: IGroupNotifications[];
  group: IGroup;
  id?: number;
  user:IUser;
  isSystemRole:boolean
}

export interface IAddMember extends baseSet {}

export interface IDeleteMember extends baseSet {}

export interface IGroupRole {
  name: string;
  groupId?: number;
  permissions: any[];
  color?: string;
  id?: number;
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
  groupId: number;
  color:string
}

export interface IDeleteRole {
  roleName: string;
  groupId: number;
}

export interface IChangeNotifications {
  isMuted: boolean;
  groupId: number;
}

export interface IGroupForm {
  name: string;
  description: string;
  avatar: string;
  private: boolean;
}
