'use client';

import Modal from '../../../main/typing-area/Modal/Modal';
import { Skeleton } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { MdOutlineModeEdit } from 'react-icons/md';
import { PiChatSlashThin } from 'react-icons/pi';

import { useStores } from '@/components/ui/chatStoreProvider';

import { IChannel } from '@/types/channel.types';
import { IChat } from '@/types/chat.types';
import { IGroup } from '@/types/group.types';

import socketService, { TSmthType } from '@/socketService';

import ChatCreateModal from './ChatCreateModal';
import ChatsItem from './ChatsItem';

interface IChats {}

export interface IChatsSearchItem {
  smthId: number;
  type: TSmthType;
}

const Chats: FC<IChats> = observer(() => {
  const { chatStore, userStore } = useStores();
  const chats = chatStore.allChats;
  const profile = userStore.user;
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const handleOnlineChange = (data: {
      event: 'offline' | 'online';
      userId: number;
    }) => {
      chatStore.changeUserFromChatOnline({
        userId: data.userId,
        event: data.event
      });
    };

    socketService.setStatusOnline(handleOnlineChange);
  }, [chatStore]);
  return (
    <div
      className={`overflow-y-auto pt-3 `}
      style={{
        height: 'calc(100vh - 71px)'
      }}
    >
      {isModalOpen ? (
        <Modal isOpen={isModalOpen}>
          <ChatCreateModal setIsOpen={setIsModalOpen} />
        </Modal>
      ) : null}
      {!profile ? (
        <div className="w-full h-[64px] ml-5 flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              avatar
              paragraph={{ rows: 1 }}
              active
              className="custom-skeleton"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {chats?.map((chat: IChat | IChannel | IGroup) => (
            <ChatsItem data={chat} key={chat?.id + (chat?.type as TSmthType)} />
          ))}

          {(chats?.length === 0)&& (
            <div className="xl:text-md lg:text-base text-sm text-center text-gray font-light opacity-35 mt-[35%] select-none">
              <PiChatSlashThin className="xl:size-40 lg:size-32 mx-auto mb-4 size-20 opacity-35" />
              Вы пока не состоите не в одном из чатов
            </div>
          )}
          <div
            onClick={() => setIsModalOpen(true)}
            className="absolute top-auto cursor-pointer xl:bottom-10 lg:bottom-5 lg:left-[210px] xl:left-[280px] lg:w-[55px] lg:h-[55px] xl:w-[60px] xl:h-[60px] hover:bg-opacity-85 rounded-full bg-accent text-white flex"
          >
            <MdOutlineModeEdit className="m-auto text-white size-6" />
          </div>
        </div>
      )}
    </div>
  );
});

export default Chats;
