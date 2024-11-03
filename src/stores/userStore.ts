import { makeAutoObservable } from 'mobx';

import { IChannelMember } from '@/types/channel.types';
import { IGroupMember } from '@/types/group.types';
import { IUser } from '@/types/user.types';

import { TSmthType } from '@/socketService';

class UserStore {
  user: IUser | null = null;
  constructor() {
    makeAutoObservable(this);
  }
  saveProfile(payload: IUser) {
    this.user = payload;
  }
  changeNotification(payload: {
    smthId: number;
    type: 'group' | 'channel';
    memberId: number;
    isMuted: boolean;
  }) {
    let member;
    if (payload.type === 'group')
      member = this.user?.groupMembers?.find(
        (i: IGroupMember) => i.id === payload.memberId
      );
    else if (payload.type === 'channel')
      member = this.user?.channelMembers?.find(
        (i: IChannelMember) => i.id === payload.memberId
      );
    if (member) {
      member.isMuted = payload.isMuted;
    }
  }

  changeChats(payload: {
    type: TSmthType;
    smthId: number;
    action: 'delete' | 'add';
    data?: any;
  }) {}
  addRole(payload: {
    type: 'channel' | 'group';
    smthId: number;
    name: string;
    permissions: any[];
    color: string;
    isSystemRole: boolean;
  }) {
    // let chat;
    // if (payload.type === 'channel') {
    //   chat = this.user?.channelMembers?.find(
    //     i => i.channelId === payload.smthId
    //   )?.channel;
    // } else {
    //   chat = this.user?.groupMembers?.find(
    //     i => i.groupId === payload.smthId
    //   )?.group;
    // }
    // if (chat) {
    //   chat?.roles?.push({
    //     isSystemRole: payload.isSystemRole,
    //     name: payload.name,
    //     permissions: payload.permissions,
    //     color: payload.color
    //   });
    // }
  }
  changeRole(payload: {
    type: 'channel' | 'group';
    smthId: number;
    roleName: string;
  }) {
    let member;

    if (payload.type === 'channel') {
      member = this.user?.channelMembers?.find(
        i => i.channelId === payload.smthId
      );
      let role = member?.channel?.roles?.find(i => i.name === payload.roleName);
      if (role) {
        (member as IChannelMember).channelRole = role;
      }
    } else {
      member = this.user?.groupMembers?.find(i => i.groupId === payload.smthId);
      let role = member?.group?.roles?.find(i => i.name === payload.roleName);
      if (role) {
        (member as IGroupMember).groupRole = role;
      }
    }
  }
  changeMembers(payload: {
    type: TSmthType;
    smthId: number;
    action: 'delete' | 'add';
    data?: any;
  }) {
    if (payload.action === 'add') {
      if (payload.type === 'channel') {
        this.user?.channelMembers?.push(payload.data);
      } else if (payload.type === 'group') {
        this.user?.groupMembers?.push(payload.data);
      }
    } else {
      if (payload.type === 'channel') {
        (this.user as IUser).channelMembers = this.user?.channelMembers?.filter(
          i => i.channelId !== payload.smthId
        );
      } else if (payload.type === 'group') {
        (this.user as IUser).groupMembers = this.user?.groupMembers?.filter(
          i => i.groupId !== payload.smthId
        );
      }
    }
  }
}

const userStore = new UserStore();
export default userStore;
