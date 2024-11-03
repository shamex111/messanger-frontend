import { Socket, io } from 'socket.io-client';

import { SERVER_URL_BASE } from './config/api.config';
import userService from './services/user.service';
import userStore from './stores/userStore';
import { IChannelMember } from './types/channel.types';
import { IGroupMember } from './types/group.types';

export type TSmthType = 'channel' | 'group' | 'chat';

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SERVER_URL_BASE, { withCredentials: true });
      this.socket.on('connect', () => console.log('конект сокета'));
      this.socket.on('disconnect', () => console.log('дисконект сокета'));
    } else {
      console.log('сокет уже есть');
    }
  }

  async disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    if (!this.socket) {
      return console.log('Сокет отсутствует!');
    }
    return this.socket;
  }

  joinPersonalRoom(userId: number) {
    if (this.socket) {
      this.socket.emit('joinPersonalRoom', userId);
      console.log(`Joined room: user_${userId}`);
    }
  }

  leavePersonalRoom(userId: number) {
    if (this.socket) {
      this.socket.emit('leavePersonalRoom', userId);
      console.log(`Left room: user_${userId}`);
    }
  }

  joinRoom(type: string, smthId: number) {
    if (this.socket) {
      this.socket.emit('join-room', { type, smthId });
      console.log('join room', type, smthId);
    }
  }

  leaveRoom(type: string, smthId: number) {
    if (this.socket) {
      this.socket.emit('leave-room', { type, smthId });
    }
  }

  subscribeToStatus(targetUserIds: number[]) {
    if (this.socket) {
      console.log('subscribe', targetUserIds[0]);
      this.socket.emit('subscribeToStatus', { targetUserIds });
    }
  }
  onEditUser(callback: () => void) {
    if (this.socket) {
      this.socket.on('edit-user', callback);
    }
  }
  offEditUser(callback: () => void) {
    if (this.socket) {
      this.socket.off('edit-user', callback);
    }
  }

  setStatusOnline(callback: any) {
    if (this.socket) {
      this.socket.on('set-status-online', callback);
    }
  }

  onChangeMember(
    callback: (data: {
      type: TSmthType;
      smthId: number;
      userId?: number;
      action: 'delete' | 'add';
      data?: IChannelMember | IGroupMember;
      chat?: any;
      name?: string;
    }) => void
  ) {
    if (this.socket) {
      this.socket.on('change-member', callback);
    }
  }
  offChangeMember(callback: () => void) {
    if (this.socket) {
      this.socket.off('change-member', callback);
    }
  }

  createRole(callback: any) {
    if (this.socket) {
      this.socket.on('create-role', callback);
    }
  }
  assignRole(callback: any) {
    if (this.socket) {
      this.socket.on('assign-role', callback);
    }
  }
  deleteChat(callback: any) {
    if (this.socket) {
      this.socket.on('delete-chat', callback);
    }
  }

  unsubscribeFromStatus(targetUserIds: number[]) {
    if (this.socket) {
      this.socket.emit('unsubscribeFromStatus', { targetUserIds });
    }
  }

  onChatUpdated(
    callback: (
      data: {
        event:
          | 'message'
          | 'message-delete'
          | 'message-status'
          | 'notification'
          | 'message-edit';
        messageId?: number;
        userId?: number;
        newContent?: string;
        newMessageData?: any;
        smthId: number;
        type: TSmthType;
        incrementOrDecrement?: 'increment' | 'decrement';
      },
      profileId?: number
    ) => void
  ) {
    if (this.socket) {
      this.socket.on('chat-updated', data => {
        let profileId;
        if (data.event === 'notification') {
          profileId = userStore?.user?.id;
        }
        callback(data, profileId);
      });
    }
  }

  offChatUpdated(callback: any) {
    if (this.socket) {
      this.socket.off('chat-updated', callback);
    }
  }
  // onUserChats(
  //   callback: (data: {
  //     event: 'delete' | 'add';
  //     type: TSmthType;
  //     smthId: number;
  //   }) => void
  // ) {
  //   if (this.socket) {
  //     this.socket.on('user-chats', data => {
  //       callback(data);
  //     });
  //   }
  // }

  // offUserChats(callback: () => void) {
  //   if (this.socket) {
  //     this.socket.off('user-chats', callback);
  //   }
  // }

  onOnlineStatus(
    callback: (data: { userId: number; event: 'online' | 'offline' }) => void
  ) {
    if (this.socket) {
      this.socket.on('set-status-online', data => {
        callback(data);
      });
    }
  }
  setOnline(userId: number, action: 'online' | 'offline') {
    if (this.socket) {
      this.socket.emit('set-online', userId, action);
    }
  }
}

const socketService = SocketService.getInstance();
export default socketService;
