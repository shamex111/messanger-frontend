'use client';

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { FC, PropsWithChildren, useEffect } from 'react';
import toast from 'react-hot-toast';

import { useStores } from '@/components/ui/chatStoreProvider';
import MainLayout from '@/components/ui/main-layout/MainLayout';
import { InviteDataProvider } from '@/components/ui/main-layout/main/inviteChat/InviteProvider';
import { useChatsData } from '@/components/ui/main-layout/sidebar/search-side-bar/chats/useChatsItemQuery';

import { PUBLIC_URl } from '@/config/url.config';

import channelService from '@/services/channel.service';
import chatService from '@/services/chat.service';
import groupService from '@/services/group.service';
import userService from '@/services/user.service';

import { IChannel, IChannelMember } from '@/types/channel.types';
import { IChat } from '@/types/chat.types';
import { IGroup, IGroupMember } from '@/types/group.types';
import { IUser } from '@/types/user.types';

import { sortChatsFn } from '@/utils/sortChats';

import socketService, { TSmthType } from '@/socketService';

const Layout: FC<PropsWithChildren<unknown>> = observer(({ children }) => {
  const { chatStore, userStore } = useStores();
  console.log('layout 3445');
  useEffect(() => {
    socketService.connect();
    const fetchProfile = async () => {
      try {
        const profile = await userService.getProfile();
        if (profile) {
          userStore.saveProfile(profile.data);
          await userService.setOnlineStatus('online');
          socketService.joinPersonalRoom(profile.data.id);
          fetchChats(profile.data);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    const fetchChats = async (profile: IUser) => {
      try {
        if (profile) {
          const channelIds = (
            profile.channelMembers as Array<IChannelMember>
          ).map((i: IChannelMember) => i.channelId);
          const groupIds = (profile.groupMembers as Array<IGroupMember>).map(
            (i: IGroupMember) => i.groupId
          );
          const personalChatIds = [
            ...(profile.personalChats as Array<IChat>).map((i: any) => i.id),
            ...(profile.personalChats2 as Array<IChat>).map((i: any) => i.id)
          ];

          const allIds = [
            ...channelIds.map(id => ({
              smthId: id,
              type: 'channel' as TSmthType
            })),
            ...groupIds.map(id => ({ smthId: id, type: 'group' as TSmthType })),
            ...personalChatIds.map(id => ({
              smthId: id,
              type: 'chat' as TSmthType
            }))
          ];

          let chats: IChat[] | IChannel[] | IGroup[] = [];
          for (const chat of allIds) {
            try {
              if (chat.type === 'chat') {
                const pChat = await chatService.getChat(chat.smthId);
                const count = (
                  profile?.PersonalChatNotification as Array<any>
                ).find((i: any) => i.personalChatId === pChat.data.id).count;
                pChat.data.count = count;
                pChat.data.type = 'chat';
                chats.push(pChat.data);
                socketService.joinRoom('chat', pChat.data.id);
              } else if (chat.type === 'channel') {
                const channel = await channelService.getChannel(chat.smthId);
                const member = channel.data.members.find(
                  (i: IChannelMember) => i.userId === profile.id
                );
                const isMuted = member.isMuted;
                const count = member.ChannelNotification.find(
                  (i: any) => i.memberId === member.id
                ).count;
                channel.data.count = count;
                channel.data.isMuted = isMuted;
                channel.data.type = 'channel';
                chats.push(channel.data);
                socketService.joinRoom('channel', channel.data.id);
              } else if (chat.type === 'group') {
                const group = await groupService.getGroup(chat.smthId);
                const member = group.data.members.find(
                  (i: IChannelMember) => i.userId === profile.id
                );
                const isMuted = member.isMuted;
                const count = member.GroupNotification.find(
                  (i: any) => i.memberId === member.id
                ).count;
                group.data.count = count;
                group.data.isMuted = isMuted;
                group.data.type = 'group';
                chats.push(group.data);
                socketService.joinRoom('group', group.data.id);
              }
            } catch (e: any) {
              toast.error(e.message || 'Ошибка при получении данных');
            }
          }

          chatStore.setChats(sortChatsFn(chats));
        }
      } catch (e: any) {
        toast.error('Ошибка в fetchChats: ' + e.message);
      }
    };

    fetchProfile();

    const handleChatUpdate = (
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
    ) => {
      switch (data.event) {
        case 'message':
          chatStore.updateChat({
            smthId: data.smthId,
            type: data.type,
            newData: data.newMessageData
          });

          break;
        case 'message-delete':
          chatStore.deleteMessage({
            smthId: data.smthId,
            type: data.type,
            messageId: data.messageId as number
          });

          break;
        case 'message-status':
          chatStore.readMessage({
            smthId: data.smthId,
            type: data.type,
            messageId: data.messageId as number
          });

          break;
        case 'message-edit':
          chatStore.editMessage({
            smthId: data.smthId,
            type: data.type,
            messageId: data.messageId as number,
            newMessageContent: data.newContent as string
          });

          break;
        case 'notification':
          if (profileId !== data.userId) {
            console.log(profileId, data.userId);
            chatStore.updateNotifications({
              smthId: data.smthId,
              type: data.type,
              incrementOrDecrement: data.incrementOrDecrement as
                | 'increment'
                | 'decrement'
            });
          }
          break;
      }
    };

    const handleMemberChange = async (data: {
      type: TSmthType;
      smthId: number;
      userId?: number;
      action: 'delete' | 'add';
      data?: IChannelMember | IGroupMember;
      chat?: any;
      name?: string;
    }) => {
      if (userStore.user?.id === data.userId) {
        chatStore.changeChats({
          type: data.type,
          smthId: data.smthId,
          userId: data.userId as number,
          action: data.action,
          dataM: data.data || null,
          dataC: userStore.user?.id === data.userId ? data.chat : null
        });
        userStore.changeMembers({
          type: data.type,
          smthId: data.smthId,
          action: data.action,
          data: data.data
        });
        if (data.action === 'delete') {
          // push(PUBLIC_URl.home());
          toast(
            `${data.type === 'chat' ? `Чат с пользователем ${data.name} был удален` : 'Вы были исключены из '}${data.type === 'channel' ? `канала ${data.name}` : data.type === 'group' ? `группы ${data.name}` : ''}`,
            {
              icon: 'ⓘ'
            }
          );
          socketService.leaveRoom(data.type, data.smthId);
        } else {
          socketService.joinRoom(data.type, data.smthId);
        }
      }
      if (data.type !== 'chat' && userStore.user?.id !== data.userId) {
        chatStore.changeMember({
          type: data.type,
          smthId: data.smthId,
          userId: data.userId as number,
          action: data.action,
          dataM: data.data || null
        });
      }
    };
    socketService.onChatUpdated(handleChatUpdate);
    socketService.onChangeMember(handleMemberChange);
    socketService.deleteChat((data:{type: 'group' | 'channel', smthId: number}) => {
      chatStore.deleteChat(data);
    });
    socketService.assignRole(
      (data: {
        type: 'group' | 'channel';
        smthId: number;
        userId: number;
        roleName: string;
      }) => {
        chatStore.assignRole(data);

        if (data.userId === userStore.user?.id) {
        }
      }
    );
    socketService.createRole(
      (data: {
        type: 'group' | 'channel';
        smthId: number;
        name: string;
        permissions: any[];
        color: string;
        isSystemRole: boolean;
      }) => {
        // userStore.addRole(data);
        chatStore.createRole(data);
      }
    );
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();

      userService
        .setOnlineStatus('offline')
        .then(() => {
          socketService.disconnect();
        })
        .catch(error => {
          console.error('Failed to set offline status:', error);
        });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      socketService.offChatUpdated(handleChatUpdate);
      socketService.offChangeMember(() => null);

      userService.setOnlineStatus('offline');
      socketService.disconnect();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [chatStore]);

  return (
    //  userStore.user ? (
    <InviteDataProvider>
      <MainLayout>{children}</MainLayout>
    </InviteDataProvider>
  );
  // ) : (
  //   <div className="mx-auto mt-[24%]  w-fit h-fit rounded-md p-2 py-1 font-medium bg-gray bg-opacity-15">
  //     Загрузка
  //   </div>
  // );
});

export default Layout;
