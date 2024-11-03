'use client';

import SideInfoBar from '../../sideinfobar/SideInfoBar';
import Chat from '../chat/Chat';
import MainTopInfoBar from '../main-top-info-bar/MainTopInfoBar';
import { Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import toast from 'react-hot-toast';

import styles from '@/app/(main)/group/[...id]/group.module.scss';

import { useChatsQuery } from '@/hooks/useChatsQuery';

import useJoinMutation from './useJoinQuery';

interface IInviteChat {
  type: 'group' | 'channel' | null;
  id: number | null;
  isDiscussion: boolean | null;
}

const InviteChat: FC<IInviteChat> = ({ type, id, isDiscussion }) => {
  const [isInfoBarOpen, setIsInfoBarOpen] = useState<boolean>(false);
  const { mutate } = useJoinMutation(
    type as 'channel' | 'group',
    id as number,
    isDiscussion as boolean
  );
  const { error, data, isLoading } = useChatsQuery({
    id: id as number,
    type: type as 'group' | 'channel'
  });

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <Spin className="mx-auto mt-[30%] px-3 py-2 bg-slate-700 bg-opacity-45 text-white font-medium text-sm rounded-md w-fit" />
      </div>
    );
  }

  if (error) {
    toast.error(error.message);
    return (
      <div className="mx-auto mt-[30%] mb-2 px-2 py-1 bg-red-500 text-white font-medium text-sm rounded-md w-fit">
        Произошла ошибка при загрузке чата.
      </div>
    );
  }

  if (!data || !data.data) {
    return (
      <div className="mx-auto mt-[30%] mb-2 px-2 py-1 bg-slate-700 bg-opacity-45 text-white font-medium text-sm rounded-md w-fit">
        Чат не найден
      </div>
    );
  }

  const handleJoin = () => {
    mutate();
  };

  const chat = { ...data.data, type };

  return (
    <div className={styles.wrapper}>
      <div
        className={`${isInfoBarOpen ? styles.mainShort : styles.main} flex flex-col h-screen duration-300`}
      >
        <MainTopInfoBar
          name={chat.name}
          isPreview={true}
          qtyUsers={chat.qtyUsers}
          smthId={id as number}
          type={type as 'group' | 'channel'}
          avatar={chat.avatar}
          isInfoBarOpen={isInfoBarOpen}
          setIsInfoBarOpen={setIsInfoBarOpen}
        />
        <Chat data={chat} isPreview={true} />
        <div
          className="text-accent m-auto cursor-pointer font-medium"
          onClick={handleJoin}
        >
          ВСТУПИТЬ
        </div>
      </div>
      <SideInfoBar
        isInfoBarOpen={isInfoBarOpen}
        chat={chat}
        setIsInfoBarOpen={setIsInfoBarOpen}
        isPreview={true}
      />
    </div>
  );
};

export default InviteChat;
