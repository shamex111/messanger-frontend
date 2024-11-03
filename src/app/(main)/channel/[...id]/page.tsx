'use client';

import { useNotificationMutation } from '../../../../components/ui/main-layout/sidebar/search-side-bar/chats/useNotificationMutation';
import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
import { FC, useMemo, useState } from 'react';

import { useStores } from '@/components/ui/chatStoreProvider';
import Chat from '@/components/ui/main-layout/main/chat/Chat';
import { EditProvider } from '@/components/ui/main-layout/main/chat/EditProvider';
import MainTopInfoBar from '@/components/ui/main-layout/main/main-top-info-bar/MainTopInfoBar';
import TypingArea from '@/components/ui/main-layout/main/typing-area/TypingArea';
import SideInfoBar from '@/components/ui/main-layout/sideinfobar/SideInfoBar';

import { IChannelMember } from '@/types/channel.types';
import { permissionsVariant } from '@/types/permissions.enum';

import styles from './channel.module.scss';

const Page: FC = observer(() => {
  const [isInfoBarOpen, setIsInfoBarOpen] = useState<boolean>(false); //change on false
  const { mutate } = useNotificationMutation();
  const { id } = useParams();
  const _chatId = Number(id[0]);
  const chatId = { id: _chatId };
  const { userStore, chatStore } = useStores();

  // const member = userStore.user?.channelMembers?.find(
  //   i => i.channelId === chatId.id
  // );

  let memberIsMuted;
  memberIsMuted = userStore.user?.channelMembers?.find(
    i => i.channelId === chatId.id
  )?.isMuted;
  const member = chatStore.allChats
    .find(i => i.type === 'channel' && i.id === chatId.id)
    ?.members?.find((i: IChannelMember) => i.user.id === userStore.user?.id);
  const chat = useMemo(() => {
    return chatStore.allChats?.find(
      (chat: any) => chat.id === chatId.id && chat.type === 'channel'
    );
  }, [chatStore, chatId, userStore]);

  const handleChangeNotifications = async () => {
    
    mutate({ isMuted: memberIsMuted as boolean, chatId: chatId.id });
    chatStore.changeNotification({
      type: 'channel',
      smthId: chat.id as number,
      isMuted: !(member as any).isMuted
    });
    userStore.changeNotification({
      smthId: chatId.id,
      type: 'channel',
      isMuted: !memberIsMuted,
      memberId: member?.id as number
    });
    // (member as any).isMuted = !isMuted;
  };

  return (
    <div className={styles.wrapper}>
      {chat ? (
        <EditProvider>
          <div
            className={`${isInfoBarOpen ? styles.mainShort : styles.main} flex flex-col h-screen duration-300`}
          >
            <MainTopInfoBar
              name={chat.name}
              qtyUsers={chat.qtyUsers}
              smthId={chatId.id}
              type="channel"
              avatar={chat.avatar}
              isInfoBarOpen={isInfoBarOpen}
              setIsInfoBarOpen={setIsInfoBarOpen}
            />
            <Chat data={chat} isInfoBarOpen={isInfoBarOpen} />
            {member?.channelRole.permissions.find(
              (i: any) => i.permission.action === permissionsVariant.sendMessage
            ) ? (
              <TypingArea type={chat.type} smthId={chat.id} />
            ) : (
              <div
                className="w-fit m-auto text-accent cursor-pointer font-medium"
                onClick={() => handleChangeNotifications()}
              >
                {memberIsMuted ? (
                  <div>ВКЛ. УВЕДОМЛЕНИЯ</div>
                ) : (
                  <div>ОТКЛ. УВЕДОМЛЕНИЯ</div>
                )}
              </div>
            )}
          </div>
          <SideInfoBar
            isInfoBarOpen={isInfoBarOpen}
            chat={chat}
            setIsInfoBarOpen={setIsInfoBarOpen}
          />
        </EditProvider>
      ) : userStore.user ? (
        <div className="mx-auto mt-[30%] mb-2 px-2 py-1 bg-slate-700 bg-opacity-45 text-white font-medium text-sm rounded-md w-fit">
          Чат не найден
        </div>
      ) : (
        <div className="mx-auto mt-[30%] mb-2 px-2 py-1 bg-slate-700 bg-opacity-45 text-white font-medium text-sm rounded-md w-fit">
          Чат загружается...
        </div>
      )}
    </div>
  );
});

export default Page;
