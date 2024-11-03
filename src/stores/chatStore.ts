import { action, makeAutoObservable } from 'mobx';

import { IChannel, IChannelMember, IChannelRole } from '@/types/channel.types';
import { IChat } from '@/types/chat.types';
import { IGroup, IGroupMember, IGroupRole } from '@/types/group.types';
import { IMessageBase } from '@/types/message.types';

import { sortChatsFn } from '@/utils/sortChats';

import { TSmthType } from '@/socketService';

class ChatStore {
  allChats: any[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setChats(payload: any[]) {
    this.allChats = payload;
  }

  setNotifications(payload: {
    type: TSmthType;
    smthId: number;
    count: number;
  }) {
    const chat = this.allChats.find(
      i => i.type === payload.type && i.id === payload.smthId
    );
    if (chat) {
      chat.count = payload.count;
    }
  }

  changeMember(payload: {
    type: 'channel' | 'group';
    smthId: number;
    userId: number;
    action: 'add' | 'delete';
    dataM?: IChannelMember | IGroupMember | null;
  }) {
    const chat = this.allChats.find(
      i => i.type === payload.type && i.id === payload.smthId
    );

    if (chat && payload.action === 'delete') {
      chat.members = chat.members.filter(
        (i: any) => i.userId !== payload.userId
      );
      chat.qtyUsers = chat.qtyUsers - 1;
    }
    if (payload.action === 'add') {
      const chat = this.allChats.find(
        i => i.type === payload.type && i.id === payload.smthId
      );
      if (chat) {
        chat.members.push(payload.dataM);
        chat.qtyUsers = chat.qtyUsers + 1;
      }
    }
  }

  changeChats = (payload: {
    type: TSmthType;
    smthId: number;
    userId: number;
    action: 'add' | 'delete';
    dataM?: IChannelMember | IGroupMember | null;
    dataC?: any;
  }) => {
    if (payload.action === 'delete') {
      const chatI = this.allChats.findIndex(
        i => i.type === payload.type && i.id === payload.smthId
      );
      if (chatI !== -1) {
        console.log('11', chatI);
        this.allChats.splice(chatI, 1);
      }
    } else if (payload.action === 'add') {
      console.log(payload.dataC);
      const chat = { ...payload.dataC, type: payload.type, count: 0 };
      console.log(chat);

      this.allChats.push(chat);
      this.allChats = sortChatsFn(this.allChats);
    }
  };

  changeNotification(payload: {
    smthId: number;
    type: 'group' | 'channel';
    isMuted: boolean;
  }) {
    const chat = this.allChats.find(
      i => i.type === payload.type && i.id === payload.smthId
    );
    if (chat) {
      chat.isMuted = payload.isMuted;
    }
  }

  updateNotifications(payload: {
    smthId: number;
    type: TSmthType;
    incrementOrDecrement: 'increment' | 'decrement';
  }) {
    const chat = this.allChats.find(
      i => i.type === payload.type && i.id === payload.smthId
    );
    if (chat) {
      chat.count += payload.incrementOrDecrement === 'increment' ? 1 : -1;
      if (chat.count < 0) chat.count = 0;
    }
  }

  updateChat(payload: { smthId: number; type: TSmthType; newData: any }) {
    const chat = this.allChats.find(
      i => i.type === payload.type && i.id === payload.smthId
    );
    if (chat) {
      chat.messages = [payload.newData, ...chat.messages];
      this.allChats = sortChatsFn(this.allChats);
    }
  }
  editChat(payload: {
    smthId: number;
    type: 'group' | 'channel';
    newData: {
      description?: string;
      name?: string;
      private?: boolean;
      avatar?: string;
    };
  }) {
    const chat = this.allChats.find(
      i => i.type === payload.type && i.id === payload.smthId
    );
    if (chat) {
      if (payload.newData.name) chat.name = payload.newData.name;
      if (payload.newData.avatar) chat.avatar = payload.newData.avatar;
      if (payload.newData.private === true || payload.newData.private === false)
        chat.private = payload.newData.private;
      if (payload.newData.description)
        chat.description = payload.newData.description;
    }
  }

  updateChatMedia(payload: { smthId: number; type: TSmthType; media: any }) {
    const chat = this.allChats.find(
      i => i.type === payload.type && i.id === payload.smthId
    );
    if (chat) {
      chat.media = [...chat.media, payload.media];
    }
  }

  createRole(payload: {
    type: 'group' | 'channel';
    smthId: number;
    name: string;
    permissions: any[];
    color: string;
    isSystemRole: boolean;
  }) {
    const chat = this.allChats.find(
      i => i.type === payload.type && i.id === payload.smthId
    );
    if (chat) {
      (chat as IChannel | IGroup).roles?.push({
        isSystemRole: payload.isSystemRole,
        name: payload.name,
        permissions: payload.permissions,
        color: payload.color
      });
    }
  }

  deleteChat(payload: { type: 'group' | 'channel'; smthId: number }) {
    const chatI = this.allChats.findIndex(
      i => i.type === payload.type && i.id === payload.smthId
    );
    if (chatI !== -1) {
      this.allChats.splice(chatI, 1);
    }
  }
  
  editRole(payload: {
    type: 'group' | 'channel';
    smthId: number;
    name: string;
    permissions: any[];
    color: string;
    roleName: string;
  }) {
    const chat = this.allChats.find(
      i => i.type === payload.type && i.id === payload.smthId
    );

    if (chat) {
      const role = (chat as IChannel | IGroup)?.roles?.find(
        i => i.name === payload.roleName
      );

      if (role) {
        role.name = payload.name;
        role.permissions = payload.permissions;
        role.color = payload.color;
      }
    }
  }

  assignRole(payload: {
    type: 'group' | 'channel';
    smthId: number;
    userId: number;
    roleName: string;
  }) {
    const chat = this.allChats.find(
      i => i.type === payload.type && i.id === payload.smthId
    );
    if (chat) {
      const member = chat.members?.find(
        (i: any) => i.user.id === payload.userId
      );
      if (payload.type === 'channel') {
        const role: IChannelRole = chat.roles.find(
          (i: IChannelRole) => i.name === payload.roleName
        );
        (member as IChannelMember).channelRole = role;
      } else {
        const role: IGroupRole = chat.roles.find(
          (i: IChannelRole) => i.name === payload.roleName
        );
        (member as IGroupMember).groupRole = role;
      }
    }
  }

  deleteMessage(payload: {
    type: TSmthType;
    smthId: number;
    messageId: number;
  }) {
    const chat = this.allChats.find(
      i => i.type === payload.type && i.id === payload.smthId
    );
    if (chat) {
      chat.messages = chat.messages.filter(
        (message: IMessageBase) => message.id !== payload.messageId
      );
      this.allChats = sortChatsFn(this.allChats);
    }
  }

  readMessage(payload: { type: TSmthType; smthId: number; messageId: number }) {
    const chat = this.allChats.find(
      i => i.type === payload.type && i.id === payload.smthId
    );
    if (chat) {
      const message = chat.messages.find(
        (message: IMessageBase) => message.id === payload.messageId
      );
      if (message) {
        message.isRead = true;
      }
    }
  }

  editMessage(payload: {
    type: TSmthType;
    smthId: number;
    messageId: number;
    newMessageContent: string;
  }) {
    const chat = this.allChats.find(
      i => i.type === payload.type && i.id === payload.smthId
    );
    if (chat) {
      let message = chat.messages.find(
        (message: IMessageBase) => message.id === payload.messageId
      );
      if (message) {
        message.content = payload.newMessageContent;
        message.isEdit = true;
      }
    }
  }

  changeUserFromChatOnline(payload: {
    event: 'online' | 'offline';
    userId: number;
  }) {
    const chat: IChat = this.allChats.find(
      i => i.type === 'chat' && i.userData.id === payload.userId
    );
    const user = chat.user1.id === payload.userId ? chat.user1 : chat.user2;
    if (chat) {
      user.isOnline = payload.event === 'online';
    }
  }

  addMessages(payload: {
    type: TSmthType;
    smthId: number;
    newMessages: any[];
  }) {
    const chat = this.allChats.find(
      i => i.type === payload.type && i.id === payload.smthId
    );
    if (chat) {
      chat.messages = [...chat.messages, ...payload.newMessages];
    }
  }
}

const chatStore = new ChatStore();
export default chatStore;
