import { useStores } from '../../chatStoreProvider';
import { useInviteContext } from '../main/inviteChat/InviteProvider';
import Modal from '../main/typing-area/Modal/Modal';
import ModalDelete from '../sidebar/search-side-bar/chats/ModalDelete';
import useDeleteMutation from '../sidebar/search-side-bar/chats/useDeleteMutation';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { AiOutlineLink } from 'react-icons/ai';
import { GoX } from 'react-icons/go';
import { IoIosAt } from 'react-icons/io';
import {
  MdDeleteOutline,
  MdOutlineModeEdit,
  MdOutlineNotificationsNone
} from 'react-icons/md';
import { TbMessage } from 'react-icons/tb';

import { SERVER_URL_BASE } from '@/config/api.config';
import { APP_URL } from '@/config/url.config';

import channelService from '@/services/channel.service';
import groupService from '@/services/group.service';

import { IChannel, IChannelMember } from '@/types/channel.types';
import { IChat } from '@/types/chat.types';
import { IGroup, IGroupMember } from '@/types/group.types';
import { permissionsVariant } from '@/types/permissions.enum';
import { IUser } from '@/types/user.types';

import { timeCalc } from '@/utils/timeCalc';
import { userEndFormat } from '@/utils/usersEndFormat';

import { TSmthType } from '@/socketService';

import styles from './SideInfoBar.module.scss';
import SideInfoBarLists from './SideInfoBarLists';
import SideInfoBarSettingsMain from './side-infobar-settings-modules/SideInfoBarSettingsMain';

interface ISideInfoBar {
  isInfoBarOpen: any;
  chat: IChat | IGroup | IChannel;
  setIsInfoBarOpen: any;
  isPreview?: boolean;
}

const SideInfoBar: FC<ISideInfoBar> = observer(
  ({ isInfoBarOpen, chat, setIsInfoBarOpen, isPreview }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSettings, setIsSettings] = useState(false);
    const { userStore, chatStore } = useStores();
    let member: any;
    const { mutate } = useDeleteMutation();
    let userForChat;
    if (chat.type === 'chat') {
      userForChat =
        (chat as IChat).user1.id === userStore.user?.id
          ? (chat as IChat).user2
          : (chat as IChat).user1;
    }
    const deleteChat = () => {
      if (chat.type === 'channel' || chat.type === 'group') {
        mutate({
          type: chat.type as 'channel' | 'group',
          smthId: chat.id as number,
          userId: userStore.user?.id as number
        });
      } else if (chat.type === 'chat') {
        mutate({
          type: chat.type,
          smthId: chat.id as number
        });
      }
    };

    // if (chat.type === 'channel') {
    // member = userStore.user?.channelMembers?.find(
    //   i => i.channelId === chat.id
    // );
    
  let memberIsMuted:boolean | undefined;
  if (chat.type === 'group')
    memberIsMuted = userStore.user?.groupMembers?.find(i => i.groupId === chat.id)?.isMuted;
  else if (chat.type === 'channel')
    memberIsMuted = userStore.user?.channelMembers?.find(i => i.channelId === chat.id)?.isMuted;
    member = chatStore.allChats
      .find(i => i.type === chat.type && i.id === chat.id)
      ?.members?.find((i: any) => i.user.id === userStore.user?.id);
    // } else if (chat.type === 'group') {
    // member = userStore.user?.groupMembers?.find(i => i.groupId === chat.id);
    // member = chatStore.allChats.find(
    // i => i.type === chat.type && i.id === chat.id
    // );
    // }
    const handleChangeNotifications = () => {
      if (chat.type === 'channel') {
        channelService.changeNotifications({
          isMuted: !memberIsMuted,
          channelId: chat.id as number
        });
        chatStore.changeNotification({
          type: chat.type,
          smthId: chat.id as number,
          isMuted: !memberIsMuted
        });
        userStore.changeNotification({
          smthId: chat.id as number,
          type: 'channel',
          isMuted: !memberIsMuted,
          memberId: member?.id as number
        });
      } else if (chat.type === 'group') {
        groupService.changeNotifications({
          isMuted: !memberIsMuted,
          groupId: chat.id as number
        });
        chatStore.changeNotification({
          type: chat.type,
          smthId: chat.id as number,
          isMuted: !memberIsMuted
        });
        userStore.changeNotification({
          smthId: chat.id as number,
          type: 'group',
          isMuted: !memberIsMuted,
          memberId: member?.id as number
        });
      }
    };
    let user: IUser | undefined;
    const { data, setData } = useInviteContext();
    const { push } = useRouter();
    const updateInvite = (
      type: 'channel' | 'group',
      id: number,
      isDiscussion: boolean
    ) => {
      setData({ type, id, isDiscussion });
    };
    if (chat.type === 'chat')
      user =
        userStore.user?.id === (chat as IChat).user1.id
          ? (chat as IChat).user2
          : (chat as IChat).user1;

    const handleDiscussion = () => {
      const chatData: any = chatStore.allChats.find(
        i => i.type === 'group' && i.id === (chat as IChannel).discussion.id
      );
      if (chatData) {
        push(`/group/${(chat as IChannel).discussion.id}`);
      } else {
        updateInvite('group', (chat as IChannel).discussion.id as number, true);
        push(`/invite`);
      }
    };
    return (
      <div
        className={`${styles.wrapper} ${isInfoBarOpen ? styles.wrapperOpen : null} lg:max-w-[347px] lg:overflow-x-hidden xl:max-w-[430px]`}
      >
        {isInfoBarOpen ? (
          <>
            {isOpen ? (
              <Modal isOpen={isOpen}>
                <ModalDelete
                  setIsOpen={setIsOpen}
                  type={chat.type as TSmthType}
                  name={
                    chat.type === 'chat'
                      ? (userForChat?.name as string)
                      : (chat as IChannel | IGroup).name
                  }
                  image={
                    chat.type === 'chat'
                      ? (userForChat?.avatar as string)
                      : (chat as IChannel | IGroup).avatar
                  }
                  deleteChat={deleteChat}
                />
              </Modal>
            ) : null}
            {isSettings ? (
              <SideInfoBarSettingsMain
                chat={chat as IChannel | IGroup}
                setIsSettings={setIsSettings}
              />
            ) : (
              <>
                <div className="flex justify-between py-1 pr-12 ml-4 h-[57px] w-full">
                  <div className="my-auto text-xl font-medium">
                    {chat.type === 'group'
                      ? 'О группе'
                      : chat.type === 'channel'
                        ? 'О канале'
                        : user?.name}
                  </div>
                  <div className="flex gap-4">
                    {(chat.type === 'chat'
                      ? null
                      : chat.type === 'group'
                        ? // ? userStore.user?.groupMembers
                          member?.groupRole.permissions // ?.find(i => i.groupId === chat.id)
                            .find(
                              (i: any) =>
                                i.permission.action ===
                                  permissionsVariant.changeDiscussion ||
                                i.permission.action ===
                                  permissionsVariant.changeRole ||
                                i.permission.action ===
                                  permissionsVariant.delete ||
                                i.permission.action === permissionsVariant.edit
                            )
                        : chat.type === 'channel'
                          ? chat.type === 'channel'
                            // ? userStore.user?.channelMembers
                            ? member?.channelRole.permissions 
                                // ?.find(i => i.channelId === chat.id)
                                ?.find(
                                  (i:any) =>
                                    i.permission.action ===
                                      permissionsVariant.changeDiscussion ||
                                    i.permission.action ===
                                      permissionsVariant.changeRole ||
                                    i.permission.action ===
                                      permissionsVariant.delete ||
                                    i.permission.action ===
                                      permissionsVariant.edit
                                )
                            : null
                          : null) && (
                      <div
                        className="my-auto cursor-pointer"
                        onClick={() => setIsSettings(true)}
                      >
                        <MdOutlineModeEdit className="size-6 text-gray" />
                      </div>
                    )}
                    {chat.type === 'channel' &&
                    (chat as IChannel).discussion ? (
                      <div
                        className="flex justify-center  cursor-pointer my-auto hover:bg-opacity-20"
                        onClick={() => handleDiscussion()}
                      >
                        <TbMessage className="size-6  text-gray" />
                      </div>
                    ) : null}
                    <div
                      className="flex justify-center  rounded-full border-border border-2 cursor-pointer my-auto hover:bg-gray hover:bg-opacity-20 p-2"
                      onClick={() => setIsInfoBarOpen(false)}
                    >
                      <GoX className="size-5 text-gray" />
                    </div>
                  </div>
                </div>
                <div className="lg:w-[347px] lg:h-[307px] xl:w-[430px] xl:h-[430px]">
                  <Image
                    src={
                      SERVER_URL_BASE +
                      (chat.type !== 'chat'
                        ? (chat as IChannel | IGroup).avatar
                        : user?.avatar)
                    }
                    alt="Автарка"
                    width={440}
                    height={440}
                    className="lg:w-[347px] lg:h-[307px] xl:w-[430px] xl:h-[430px]"
                  />
                  <div className="relative bottom-14 left-4 text-xl font-medium">
                    {chat.type !== 'chat'
                      ? (chat as IChannel | IGroup).name
                      : user?.name}
                  </div>
                  <div className="relative bottom-14 left-4 text-sm">
                    {chat.type === 'channel'
                      ? userEndFormat((chat as IChannel).qtyUsers, 'channel')
                      : chat.type === 'group'
                        ? userEndFormat((chat as IGroup).qtyUsers, 'group')
                        : user?.isOnline
                          ? 'В сети'
                          : 'Был(а) в сети ' +
                            timeCalc(new Date(user?.lastOnline as Date), true)}
                  </div>
                </div>
                <div>
                  <div className="flex flex-col xl:mt-3 lg:mt-2 py-4 gap-4">
                    {(
                      chat.type !== 'chat'
                        ? (chat as IChannel | IGroup).description.trim()
                        : user?.description
                    ) ? (
                      <div className="ml-4 max-w-[80%] flex gap-9">
                        <AiOutlineInfoCircle className="size-6  my-auto text-gray" />
                        <div className="max-w-[80%]">
                          {chat.type !== 'chat'
                            ? (chat as IChannel | IGroup).description
                            : user?.description}
                          <div className="text-gray font-medium text-base">
                            Информация
                          </div>
                        </div>
                      </div>
                    ) : null}
                    {chat.type !== 'chat' ? (
                      <div
                        className="mx-2 px-2 rounded-lg flex gap-9 hover:bg-gray hover:bg-opacity-15 cursor-pointer py-1"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${APP_URL}/${chat.type as TSmthType}/${chat.id as number}`
                          );
                          toast.success('Текст скопирован');
                        }}
                      >
                        <AiOutlineLink className="size-6  my-auto text-gray" />
                        <div className="max-w-[80%]">
                          {`${APP_URL}/${chat.type as TSmthType}/${chat.id as number}`}
                          <div className="text-gray font-medium text-base">
                            Ссылка
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="mx-2 px-2 rounded-lg flex gap-9 hover:bg-gray hover:bg-opacity-15 cursor-pointer py-1"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            user?.username as string
                          );
                          toast.success('Текст скопирован');
                        }}
                      >
                        <IoIosAt className="size-6 my-auto text-gray" />
                        <div className="max-w-[80%]">
                          @{user?.username}
                          <div className="text-gray font-medium text-base">
                            Имя пользователя
                          </div>
                        </div>
                      </div>
                    )}
                    {chat.type !== 'chat' &&
                    (chat.type === 'group'
                      ? userStore.user?.groupMembers?.find(
                          i => i.groupId === chat.id
                        )
                      : userStore.user?.channelMembers?.find(
                          i => i.channelId === chat.id
                        )) ? (
                      <div className="mx-2 px-2 rounded-lg flex gap-9 hover:bg-gray hover:bg-opacity-15 cursor-pointer py-1 h-[56px] ">
                        <MdOutlineNotificationsNone className="size-6 my-auto text-gray" />
                        <div className="my-auto">Уведомления</div>
                        <label className={styles.switch}>
                          <input
                            type="checkbox"
                            checked={!memberIsMuted}
                            onClick={handleChangeNotifications}
                          />
                          <span className={styles.slider}></span>
                        </label>
                      </div>
                    ) : null}
                    {<SideInfoBarLists chat={chat} />}
                    {!isPreview ? (
                      <div
                        className="mx-2 px-2 rounded-lg flex gap-9 hover:bg-gray hover:bg-opacity-15 cursor-pointer h-[56px] "
                        onClick={() => setIsOpen(true)}
                      >
                        <div className="flex gap-9">
                          <MdDeleteOutline
                            className="size-6 my-auto"
                            color="#e53935"
                          />
                          <div className="text-[#e53935] my-auto ">
                            {chat.type === 'channel'
                              ? 'Выйти из канала'
                              : chat.type === 'group'
                                ? 'Выйти из группы'
                                : 'Удалить чат'}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </>
            )}
          </>
        ) : null}
      </div>
    );
  }
);

export default SideInfoBar;
