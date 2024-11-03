'use client';

import { useParams } from 'next/navigation';
import { FC, useMemo, useState } from 'react';

import { useStores } from '@/components/ui/chatStoreProvider';
import Chat from '@/components/ui/main-layout/main/chat/Chat';
import { EditProvider } from '@/components/ui/main-layout/main/chat/EditProvider';
import MainTopInfoBar from '@/components/ui/main-layout/main/main-top-info-bar/MainTopInfoBar';
import TypingArea from '@/components/ui/main-layout/main/typing-area/TypingArea';
import SideInfoBar from '@/components/ui/main-layout/sideinfobar/SideInfoBar';

import { IChat } from '@/types/chat.types';

import styles from './chat.module.scss';
import { observer } from 'mobx-react-lite';

const page: FC = observer(() => {
  const [isInfoBarOpen, setIsInfoBarOpen] = useState<boolean>(false);
  const { id } = useParams();
  const _chatId = Number(id[0])
  const chatId = {id:_chatId}
  const { chatStore, userStore } = useStores();

  const chat = useMemo(() => {
    return chatStore.allChats.find(
      (chat: any) => chat.id === chatId.id && chat.type === 'chat'
    );
  }, [chatStore, chatId, id,userStore]);
  return (
    <div className={styles.wrapper}>
      {chat ? (
        <EditProvider>
          <div
            className={`${isInfoBarOpen ? styles.mainShort : styles.main} flex flex-col h-screen duration-300`}
          >
            <MainTopInfoBar
              name={
                userStore.user?.id === (chat as IChat).user1.id
                  ? (chat as IChat).user2.name
                  : (chat as IChat).user1.name
              }
              isOnline={
                userStore.user?.id === (chat as IChat).user1.id
                  ? (chat as IChat).user2.isOnline
                  : (chat as IChat).user1.isOnline
              }
              lastOnline={
                userStore.user?.id === (chat as IChat).user1.id
                  ? (chat as IChat).user2.lastOnline
                  : (chat as IChat).user1.lastOnline
              }
              smthId={chatId.id}
              type="chat"
              avatar={
                userStore.user?.id === (chat as IChat).user1.id
                  ? (chat as IChat).user2.avatar
                  : (chat as IChat).user1.avatar
              }
              isInfoBarOpen={isInfoBarOpen}
              setIsInfoBarOpen={setIsInfoBarOpen}
            />
            <Chat data={chat} isInfoBarOpen={isInfoBarOpen}/>

            <TypingArea type={chat.type} smthId={chat.id} />
          </div>
          <SideInfoBar
            isInfoBarOpen={isInfoBarOpen}
            chat={chat}
            setIsInfoBarOpen={setIsInfoBarOpen}
          />
        </EditProvider>
      ) : (
        userStore.user ? 
        <div className="mx-auto mt-[30%] mb-2 px-2 py-1 bg-slate-700 bg-opacity-45 text-white font-medium text-sm rounded-md w-fit">
          Чат не найден
        </div> : <div className="mx-auto mt-[30%] mb-2 px-2 py-1 bg-slate-700 bg-opacity-45 text-white font-medium text-sm rounded-md w-fit">
          Чат загружается...
        </div>
      )}
    </div>
  );
})

export default page;
