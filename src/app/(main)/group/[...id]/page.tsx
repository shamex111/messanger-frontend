'use client';

import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
import { FC, useMemo, useState } from 'react';

import { useStores } from '@/components/ui/chatStoreProvider';
import Chat from '@/components/ui/main-layout/main/chat/Chat';
import { EditProvider } from '@/components/ui/main-layout/main/chat/EditProvider';
import MainTopInfoBar from '@/components/ui/main-layout/main/main-top-info-bar/MainTopInfoBar';
import TypingArea from '@/components/ui/main-layout/main/typing-area/TypingArea';
import SideInfoBar from '@/components/ui/main-layout/sideinfobar/SideInfoBar';

import { permissionsVariant } from '@/types/permissions.enum';

import styles from './group.module.scss';
import { IGroupMember } from '@/types/group.types';

const page: FC = observer(() => {
  const [isInfoBarOpen, setIsInfoBarOpen] = useState<boolean>(false);//chnag eon false
  const { id } = useParams();
  const _chatId = Number(id[0])
  const chatId = {id:_chatId}
  const { chatStore, userStore } = useStores();
  // const member = userStore.user?.groupMembers?.find(i => i.groupId === chatId.id);
  const member = chatStore.allChats.find(i => i.type === 'group' && i.id === chatId.id)?.members?.find((i:IGroupMember) => i.user.id === userStore.user?.id);

  const chat = useMemo(() => {
    return chatStore.allChats.find(
      (chat: any) => chat.id === chatId.id && chat.type === 'group'
    );
  }, [chatStore, chatId, id, userStore]);

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
              type="group"
              avatar={chat.avatar}
              isInfoBarOpen={isInfoBarOpen}
              setIsInfoBarOpen={setIsInfoBarOpen}
            />
            <Chat data={chat} isInfoBarOpen={isInfoBarOpen}/>
            {member?.groupRole?.permissions?.find(
              (i:any) => i.permission.action === permissionsVariant.sendMessage
            ) ? (
              <TypingArea type={chat.type} smthId={chat.id} />
            ) : (
              <div className="text-gray text-opacity-35 m-auto text-sm">
                Вы не можете писать в данной группе
              </div>
            )}
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
});

export default page;
