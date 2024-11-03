'use client';

import Modal from '../../../main/typing-area/Modal/Modal';
import { Skeleton } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { BsVolumeMuteFill } from 'react-icons/bs';
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from 'react-icons/io5';
import { MdDeleteOutline, MdOutlineMarkChatRead } from 'react-icons/md';
import { MdOutlineNotificationsNone } from 'react-icons/md';
import { MdOutlineNotificationsOff } from 'react-icons/md';
import { TbPointFilled } from 'react-icons/tb';

import { useStores } from '@/components/ui/chatStoreProvider';

import { SERVER_URL_BASE } from '@/config/api.config';

import channelService from '@/services/channel.service';
import groupService from '@/services/group.service';

import { IChannel } from '@/types/channel.types';
import { IChat } from '@/types/chat.types';
import { IGroup } from '@/types/group.types';
import { IMessageBase } from '@/types/message.types';
import { IUser } from '@/types/user.types';

import { timeCalc } from '@/utils/timeCalc';

import { TSmthType } from '@/socketService';

import ModalDelete from './ModalDelete';
import useDeleteMutation from './useDeleteMutation';

export interface IChatsItem {
  data: IChat | IChannel | IGroup;
}

const ChatsItem: FC<IChatsItem> = observer(({ data }) => {
  const { chatStore, userStore } = useStores();
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const profile = userStore.user;
  const pathname = usePathname();
  const isActive = pathname === `/${data.type}/${data.id}`;
  const userId = profile?.id as number;
  const [isOpen, setIsOpen] = useState(false);
  const { mutate } = useDeleteMutation();
  let member: any;

  if (data.type === 'channel') {
    member = userStore.user?.channelMembers?.find(i => i.channelId === data.id);
  } else if (data.type === 'group') {
    member = userStore.user?.groupMembers?.find(i => i.groupId === data.id);
  }
  let userForChat;
  if (data.type === 'chat') {
    userForChat =
      (data as IChat).user1.id === userId
        ? (data as IChat).user2
        : (data as IChat).user1;
  }
  const count = data?.count;
  const handleContextMenu = (event: any) => {
    event.preventDefault();
    setMenuPosition({ x: event.pageX, y: event.pageY });
    setContextMenuVisible(true);
  };

  const handleClick = () => {
    if (contextMenuVisible) {
      setContextMenuVisible(false);
    }
  };

  const deleteChat = () => {
    if (data.type === 'channel' || data.type === 'group') {
      mutate({
        type: data.type,
        smthId: data.id as number,
        userId: userStore.user?.id
      });
    } else if (data.type === 'chat') {
      mutate({
        type: data.type,
        smthId: data.id as number
      });
    }
  };

  const handleChangeNotifications = () => {
    if (data.type === 'channel') {
      channelService.changeNotifications({
        isMuted: !(member as IChannel | IGroup).isMuted,
        channelId: data.id as number
      });
      chatStore.changeNotification({
        type: data.type,
        smthId: data.id as number,
        isMuted: !(member as IChannel | IGroup).isMuted
      });
      userStore.changeNotification({
        smthId: data.id as number,
        type: 'channel',
        isMuted: !(member as IChannel | IGroup).isMuted,
        memberId: member?.id as number
      });
    } else if (data.type === 'group') {
      groupService.changeNotifications({
        isMuted: !(member as IChannel | IGroup).isMuted,
        groupId: data.id as number
      });
      chatStore.changeNotification({
        type: data.type,
        smthId: data.id as number,
        isMuted: !(member as IChannel | IGroup).isMuted
      });
      userStore.changeNotification({
        smthId: data.id as number,
        type: 'group',
        isMuted: !(member as IChannel | IGroup).isMuted,
        memberId: member?.id as number
      });
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleClick);
    };
  }, [contextMenuVisible]);

  if (
    (!count && count !== 0) ||
    (data.type === 'chat' && !userForChat) ||
    !data ||
    !profile
  ) {
    return (
      <Skeleton
        avatar
        paragraph={{ rows: 1 }}
        active
        className="custom-skeleton ml-5"
      />
    );
  }

  const lastMessage = (data.messages as Array<IMessageBase>)[0];

  return (
    <>
      {isOpen ? (
        <Modal isOpen={isOpen}>
          <ModalDelete
            setIsOpen={setIsOpen}
            type={data.type as TSmthType}
            name={
              data.type === 'chat'
                ? (userForChat?.name as string)
                : (data as IChannel | IGroup).name
            }
            image={
              data.type === 'chat'
                ? (userForChat?.avatar as string)
                : (data as IChannel | IGroup).avatar
            }
            deleteChat={deleteChat}
          />
        </Modal>
      ) : null}
      {contextMenuVisible ? (
        <ul
          className={`custom-context-menu bg-secondary bg-opacity-85  rounded-md lg:w-[200px] z-50 py-2 absolute lg:left-12 xl:left-20 cursor-pointer`}
          style={{
            backdropFilter: 'blur(5px)',
            top: `${menuPosition.y}px`
          }}
        >
        
          {data.type !== 'chat' ? (
            <li className="hover:bg-main rounded-lg bg-opacity-45 px-2 mx-1 ">
              <div
                className="flex gap-4 ml-2 mb-1 py-2 "
                onClick={() => handleChangeNotifications()}
              >
                {(member as IChannel | IGroup)?.isMuted ? (
                  <MdOutlineNotificationsNone className="size-5 my-auto text-gray" />
                ) : (
                  <MdOutlineNotificationsOff className="size-5 my-auto text-gray" />
                )}
                {(member as IChannel | IGroup)?.isMuted ? (
                  <div className="my-auto text-sm font-medium">Вкл. звук</div>
                ) : (
                  <div className="my-auto text-sm font-medium">Заглушить</div>
                )}
              </div>
            </li>
          ) : null}
          <li
            className="hover:bg-main rounded-md bg-opacity-45 px-2 mx-1"
            // onClick={() => deleteChat()}
            onClick={() => setIsOpen(true)}
          >
            <div className="flex gap-4 ml-2 py-2">
              <MdDeleteOutline className="size-5 my-auto" color="#e53935" />
              <div className="text-[#e53935] my-auto font-bold text-sm">
                {data.type === 'channel'
                  ? 'Выйти из канала'
                  : data.type === 'group'
                    ? 'Выйти из группы'
                    : 'Удалить чат'}
              </div>
            </div>
          </li>
        </ul>
      ) : null}

      <Link href={`/${data.type}/${data.id}`}>
        <div
          className={`flex ml-2 pl-3 mr-2 p-2 py-3 h-[72px] rounded-xl gap-3 cursor-pointer ${
            isActive
              ? 'bg-accent bg-opacity-60'
              : 'hover:bg-gray hover:bg-opacity-35'
          } ${contextMenuVisible ? 'bg-gray bg-opacity-35' : null}`}
          onContextMenu={e => handleContextMenu(e)}
        >
          {data.type === 'chat' ? (
            <>
              <div>
                <Image
                  src={SERVER_URL_BASE + (userForChat as IUser).avatar}
                  alt="Аватарка"
                  width={50}
                  height={50}
                  className="rounded-full w-[50px] h-[50px]"
                />
                {(userForChat as IUser).isOnline ? (
                  <TbPointFilled
                    color="#0ac630"
                    className="relative bottom-5 left-8 font-semibold text-2xl"
                  />
                ) : null}
              </div>
              <div className="flex flex-col justify-between">
                <div className="font-medium">
                  {(userForChat as IUser).name.slice(0, 15)}
                </div>
                <div
                  className={`${isActive ? 'text-white' : 'text-gray'} text-[13.5px]`}
                >
                  {lastMessage?.content ? (
                    `${lastMessage.content.substr(0, 18)}${lastMessage.content.length > 18 ? '...' : ''}`
                  ) : // <div className='lg:max-w-[140px] xl:max-w-[180px] max-h-5 overflow-hidden'>
                  //   <span className="lg:max-w-[130px] max-h-4 xl:max-w-[170px] overflow-hidden">
                  //     {lastMessage?.content}
                  //   </span>
                  //   <span>{lastMessage.content.length > 12 ? '...' : ''}</span>
                  // </div>
                  lastMessage?.media.length ? (
                    <div className="flex gap-1">
                      <div>
                        {lastMessage.media[0].type === 'image' ? (
                          <Image
                            src={SERVER_URL_BASE + lastMessage.media[0].url}
                            alt="Img"
                            width={15}
                            height={20}
                            className="h-[22px] w-[18px] rounded-sm"
                          />
                        ) : (
                          <video
                            src={SERVER_URL_BASE + lastMessage.media[0].url}
                            className="h-[22px] w-[18px] rounded-sm bg- object-cover"
                            autoPlay
                            muted
                          />
                        )}
                      </div>
                      <div>
                        {lastMessage.media[0].type === 'image'
                          ? 'Фотография'
                          : 'Видео'}
                      </div>
                    </div>
                  ) : (
                    'Сообщений нет'
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <Image
                src={SERVER_URL_BASE + (data as IChannel | IGroup).avatar}
                alt="Аватарка"
                width={50}
                height={50}
                className="rounded-full w-[50px] h-[50px]"
              />
              <div className="flex flex-col justify-between">
                <div className="font-medium flex gap-2">
                  {(data as IChannel | IGroup).name.slice(0, 18)}
                  {(member as IChannel | IGroup).isMuted ? (
                    <BsVolumeMuteFill className="text-gray size-[15px] my-auto" />
                  ) : null}
                </div>
                <div
                  className={`${isActive ? 'text-white' : 'text-gray'} text-[13.5px] flex gap-[4px]`}
                >
                  {data.type === 'group' && lastMessage && (
                    <div className="text-white">
                      {(lastMessage?.sender?.id === userStore.user?.id
                        ? 'Вы'
                        : lastMessage?.sender?.name) + ':'}
                    </div>
                  )}
                  {lastMessage?.content ? (
                    // `${lastMessage.content.substr(0, 17)}${lastMessage.content.length > 17 ? '...' : ''}`
                    <>
                      <span className={`lg:max-w-[100px] max-h-4 xl:max-w-[170px] overflow-hidden ${data.type === 'channel' ? 'mb-[5px]':''}`}>
                        {lastMessage?.content}
                      </span>
                      {lastMessage.content.length > 12 ? '...' : ''}
                    </>
                  ) : lastMessage?.media.length ? (
                    <div className="flex gap-1">
                      <div>
                        {lastMessage.media[0].type === 'image' ? (
                          <Image
                            src={SERVER_URL_BASE + lastMessage.media[0].url}
                            alt="Img"
                            width={15}
                            height={20}
                            className="h-[22px] w-[18px] rounded-sm"
                          />
                        ) : (
                          <video
                            src={SERVER_URL_BASE + lastMessage.media[0].url}
                            className="h-[22px] w-[18px] rounded-sm bg- object-cover"
                            autoPlay
                            muted
                          />
                        )}
                      </div>
                      <div>
                        {lastMessage.media[0].type === 'image'
                          ? 'Фотография'
                          : 'Видео'}
                      </div>
                    </div>
                  ) : (
                    'Сообщений нет'
                  )}
                </div>
              </div>
            </>
          )}
          {lastMessage && (
            <div className="ml-auto flex flex-col justify-between">
              <div
                className={`text-xs font-light ${isActive ? 'text-white' : 'text-gray'}`}
              >
                {timeCalc(new Date(lastMessage.createdAt as string), false)}
              </div>
              <div>
                {lastMessage.senderId === profile?.id &&
                data.type !== 'channel' ? (
                  lastMessage.isRead ? (
                    <IoCheckmarkDoneSharp
                      className={`ml-auto mt-auto ${isActive ? 'text-white' : 'text-accent'}`}
                    />
                  ) : (
                    <IoCheckmarkSharp
                      className={`ml-auto mt-auto ${isActive ? 'text-white' : 'text-gray'}`}
                    />
                  )
                ) : (
                  <>
                    {count ? (
                      <div
                        className={`${data.type !== 'chat' && (member as IChannel | IGroup)?.isMuted ? 'bg-[#717579]' : 'bg-accent'} ml-auto w-[25px] font-medium h-[25px] duration-100  flex justify-center rounded-full  ${count >= 999 ? 'text-[8px]' : count >= 100 ? 'text-[11px]' : 'text-[13px]'}`}
                      >
                        <div className="m-auto">
                          {count > 999 ? '999+' : count}
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </>
  );
});

export default ChatsItem;
