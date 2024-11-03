import { useUserQuery } from '../../../sidebar/search-side-bar/chats/useUserQuery';
import { useCreateChatMutation } from '../../../sidebar/search-side-bar/searchSideBarItem/useCreateChatMutation';
import { useInviteContext } from '../../inviteChat/InviteProvider';
import Modal from '../../typing-area/Modal/Modal';
import { useEdit } from '../EditProvider';
import { Skeleton } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import toast from 'react-hot-toast';
import { BsFillEyeFill } from 'react-icons/bs';
import { IoIosArrowDown } from 'react-icons/io';
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from 'react-icons/io5';
import { LuUsers2 } from 'react-icons/lu';
import { MdDeleteOutline } from 'react-icons/md';
import { MdOutlineEdit } from 'react-icons/md';
import { MdOutlineContentCopy } from 'react-icons/md';

import { useStores } from '@/components/ui/chatStoreProvider';

import { SERVER_URL_BASE } from '@/config/api.config';

import { IAttachment, IMessageBase } from '@/types/message.types';

import { formatViews } from '@/utils/formatViews';
import { isOtherDayFn } from '@/utils/isOtherDay';
import { timeCalc } from '@/utils/timeCalc';

import { TSmthType } from '@/socketService';

import styles from './ChatMessage.module.scss';
import ImageModal from './ImageModal';
import { useDeleteMutation } from './useDeleteMutation';

interface IChatMessage {
  message: IMessageBase;
  type: TSmthType;
  beforeMessage: IMessageBase;
  afterMessage: IMessageBase;
  id: number;
  smthId: number;
}

const ChatMessage: FC<IChatMessage> = observer(
  ({ message, type, afterMessage, beforeMessage, id, smthId }) => {
    const { userStore, chatStore } = useStores();
    const profile = userStore.user;
    const isNotChannel = type !== 'channel';
    const { mutate } = useDeleteMutation();
    const isUserMessage = message.senderId === profile?.id;
    const userData = message.sender;
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [isUserList, setIsUserList] = useState(false);
    const { push } = useRouter();
    const [isOpenImageModal, setIsOpenImageModal] = useState<{
      type: '' | 'image' | 'video';
      url: string;
    }>({ type: '', url: '' });
    const { isEditMessageId, setIsEdit } = useEdit();
    const { mutate: createChatMutation } = useCreateChatMutation();

    const { data, setData } = useInviteContext();

    const handleChat = async () => {
      const chat = chatStore.allChats.find(
        i =>
          i.type === 'chat' &&
          (i.user1Id === message.senderId || i.user2Id === message.senderId)
      );
      if (chat) {
        push(`/chat/${chat.id}`);
      } else {
        createChatMutation(
          {
            data: {
              user1Id: userStore?.user?.id as number,
              user2Id: message.senderId
            },
            type: 'chat'
          },
          {
            onSuccess: () => {
              const chat = chatStore.allChats.find(
                i =>
                  i.type === 'chat' &&
                  (i.user1Id === message.senderId ||
                    i.user2Id === message.senderId)
              );
              if (chat) {
                push(`/chat/${chat.id}`);
              }
            }
          }
        );
      }
    };
    const handleContextMenu = (event: any) => {
      if (isUserMessage) {
        event.preventDefault();
        setMenuPosition({ x: event.pageX, y: event.pageY });
        setContextMenuVisible(true);
      }
    };
    const handleEditClick = () => {
      setIsEdit(message?.id as number);
    };
    const handleClick = () => {
      if (contextMenuVisible) {
        if (!isUserList) {
          setContextMenuVisible(false);
        } else {
          setContextMenuVisible(false);
          setIsUserList(false);
        }
      }
    };

    useEffect(() => {
      document.addEventListener('click', handleClick);
      document.addEventListener('contextmenu', handleClick);
      return () => {
        document.removeEventListener('click', handleClick);
        document.removeEventListener('contextmenu', handleClick);
      };
    }, [contextMenuVisible, isUserList]);

    const params = {
      isFirst:
        (!beforeMessage || beforeMessage.senderId !== message.senderId) &&
        (!afterMessage || afterMessage?.senderId === message.senderId),
      isMiddle:
        beforeMessage?.senderId === message.senderId &&
        afterMessage?.senderId === message.senderId,
      isLast:
        beforeMessage?.senderId === message.senderId &&
        (!afterMessage || afterMessage.senderId !== message.senderId),
      isAlone:
        beforeMessage?.senderId !== message.senderId &&
        afterMessage?.senderId !== message.senderId
    };
    const isUnread = useMemo(() => {
      return (
        message?.isRead === false &&
        beforeMessage?.isRead === true &&
        !isUserMessage
      );
    }, []);

    const isOtherDay = isOtherDayFn(
      new Date(beforeMessage?.createdAt as string),
      new Date(message.createdAt as string)
    );
    return (
      <div
        className={`w-full flex py-[3px] flex-col duration-300 px-[20%] ${contextMenuVisible ? 'bg-blue-400 bg-opacity-35  ' : ''} `}
        id={`message-${id}`}
        onContextMenu={handleContextMenu}
      >
        {isOtherDay && (
          <div className="mx-auto mb-2 px-2 py-1 bg-slate-700 bg-opacity-45 text-white font-medium text-sm rounded-md w-fit">
            {isOtherDay}
          </div>
        )}
        {isUnread && (
          <div className="mx-auto mb-2 py-1 px-3 flex gap-1 bg-slate-700 bg-opacity-45 text-white font-medium text-sm rounded-sm w-fit ">
            <span>Непрочитанные сообщения</span>{' '}
            <IoIosArrowDown className="my-auto" />
          </div>
        )}
        {contextMenuVisible &&
          (isUserList ? (
            <ul
              className={`custom-context-menu bg-secondary  rounded-md lg:w-[350px] xl:w-[500px] max-h-screen overflow-y-auto z-50 py-2 flex flex-col gap-2 pl-3 lg:right-[350px] xl:right-[650px]`}
              style={{
                top: '2px',
                left: `auto`,
                position: 'absolute',
                backdropFilter: ' blur(5px)'
              }}
            >
              <div className="text-2xl font-semibold mb-2">
                Прочитано {message.readGroups.length} польз.
              </div>
              {message.readGroups.map((i: any) => {
                return (
                  <li className="flex gap-3">
                    <Image
                      src={SERVER_URL_BASE + i.member.user.avatar}
                      alt="Аватарка"
                      width={40}
                      height={40}
                      className="rounded-full w-[40px] h-[40px] my-auto "
                    />
                    <div className=" flex flex-col">
                      <div className="font-semibold">{i.member.user.name}</div>
                      <div className="flex gap-2">
                        <IoCheckmarkDoneSharp className="text-gray size-4 my-auto" />
                        <div className="text-gray text-sm">
                          {timeCalc(new Date(i.createdAt), true)}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul
              className="custom-context-menu cursor-pointer bg-secondary bg-opacity-85  rounded-md lg:w-[200px] z-50 py-2     "
              style={{
                top: `${menuPosition.y}px`,
                left: `${menuPosition.x}px`,
                position: 'absolute',
                backdropFilter: ' blur(5px)'
              }}
            >
              <li
                className="hover:bg-main rounded-lg bg-opacity-45 px-2 mx-1 "
                onClick={handleEditClick}
              >
                <div className="flex gap-4 ml-2 mb-1 py-1 ">
                  <MdOutlineEdit className="size-6 my-auto" />
                  <div className="my-auto text-sm font-medium">Изменить</div>
                </div>
              </li>
              <li
                className="hover:bg-main rounded-lg bg-opacity-45 px-2 mx-1 "
                onClick={() => {
                  navigator.clipboard.writeText(`${message.content}`);
                  toast.success('Текст скопирован');
                }}
              >
                <div className="flex gap-4 ml-2 mb-1 py-1 pr-2">
                  <MdOutlineContentCopy className="size-5 my-auto" />
                  <div className="my-auto text-sm font-medium">Копировать</div>
                </div>
              </li>
              <li
                className="hover:bg-main py-1 rounded-md bg-opacity-45 px-2 mx-1"
                onClick={() => mutate(message?.id as number)}
              >
                <div className="flex gap-4 ml-2">
                  <MdDeleteOutline className="size-6 my-auto" color="#e53935" />
                  <div className="text-[#e53935] my-auto  text-sm font-bold">
                    Удалить
                  </div>
                </div>
              </li>
              {type !== 'channel' ? (
                <div className="w-full h-[5px] mt-2 bg-gray bg-opacity-30"></div>
              ) : null}
              <div className="px-4">
                {message.isRead ? (
                  <div className="flex gap-3 text-sm text-white mt-2">
                    {type === 'group' ? (
                      <div
                        className="cursor-pointer flex gap-3  text-sm text-white"
                        onClick={() => {
                          if (message.readGroups.length !== 0)
                            setIsUserList(true);
                        }}
                      >
                        <LuUsers2 className="my-auto size-4 " />
                        <div className="my-auto ">
                          {message.readGroups.length !== 0
                            ? 'Прочит...'
                            : 'Непрочитано'}
                        </div>
                      </div>
                    ) : (
                      <>
                        <IoCheckmarkDoneSharp className="text-white text-base size-5 " />
                        <div>Прочитано</div>
                      </>
                    )}
                    <div className="flex ml-auto ">
                      {type === 'channel'
                        ? null
                        : type === 'group'
                          ? message.readGroups.map((i: any, ind: number) => {
                              if (ind < 3) {
                                return (
                                  <Image
                                    src={SERVER_URL_BASE + i.member.user.avatar}
                                    alt="Аватарка"
                                    width={30}
                                    height={30}
                                    className={`w-[30px] h-[30px] rounded-full relative ${ind === 1 ? 'right-5 z-10' : ind === 2 ? 'right-10 z-20' : ''}`}
                                  />
                                );
                              }
                            })
                          : type === 'chat'
                            ? null
                            : 'Ошибка'}
                    </div>
                  </div>
                ) : type !== 'channel' ? (
                  <div className="flex gap-3 text-sm text-gray mt-2">
                    <IoCheckmarkSharp className="text-gray text-base size-5" />
                    <div>Непрочитано</div>
                  </div>
                ) : null}
              </div>
            </ul>
          ))}
        <div
          className={`${styles.wrapper} ${isUserMessage && isNotChannel && styles.userMessagePosition} `}
        >
          {!isUserMessage && isNotChannel && (
            <>
              {params.isLast ||
              params.isAlone ||
              (!params.isFirst && !params.isMiddle && !params.isLast) ? (
                <Image
                  src={SERVER_URL_BASE + userData?.avatar}
                  alt="avatar"
                  width={30}
                  height={30}
                  className={`${styles.image} cursor-pointer`}
                  onClick={type === 'group' ? () => handleChat() : () => null}
                />
              ) : (
                <div className={styles.image} />
              )}
            </>
          )}
          <div className={styles.rightPart}>
            <div
              className={`${styles.contentWrapper} ${isUserMessage && isNotChannel && styles.userMessageBg} ${params.isFirst && isNotChannel && styles.first} ${params.isMiddle && isNotChannel && styles.middle} ${params.isLast && isNotChannel && styles.last} `}
              // onContextMenu={handleContextMenu}
            >
              <div className="flex flex-col">
                <div className={styles.infoMessage}>
                  {isNotChannel && (
                    <>
                      <span className="font-medium">
                        {!isUserMessage
                          ? isNotChannel && (params.isFirst || params.isAlone)
                            ? userData?.name
                            : null
                          : null}
                      </span>
                      {type === 'group' &&
                      (params.isFirst || params.isAlone) ? (
                        <span
                          className={`text-xs ${!isUserMessage ? 'ml-2' : ''}`}
                          style={{
                            color: userData?.groupMembers?.find(
                              i => i.groupId === smthId
                            )?.groupRole.color
                          }}
                        >
                          {userData?.groupMembers?.find(
                            i => i.groupId === smthId
                          )?.groupRole.name !== 'Участник' &&
                            userData?.groupMembers?.find(
                              i => i.groupId === smthId
                            )?.groupRole.name}
                        </span>
                      ) : null}
                    </>
                  )}

                  {message.media.length ? (
                    <div className={`flex flex-wrap gap-1`}>
                      {message.media.map((i: IAttachment, ind: number) => (
                        <div key={i.id} className={`relative`}>
                          {i.type === 'image' ? (
                            <>
                              {isOpenImageModal.type === 'image' ? (
                                i.url === isOpenImageModal.url ? (
                                  <Modal
                                    isOpen={isOpenImageModal ? true : false}
                                  >
                                    <ImageModal
                                      type="image"
                                      setClose={() =>
                                        setIsOpenImageModal({
                                          type: '',
                                          url: ''
                                        })
                                      }
                                      isOpen={isOpenImageModal}
                                    />
                                  </Modal>
                                ) : null
                              ) : null}
                              <Image
                                src={SERVER_URL_BASE + i.url}
                                alt="Фотография"
                                width={476}
                                height={476}
                                className={`${
                                  (ind + 1) % 3 === 0 ||
                                  message.media.length === 1 ||
                                  (message.media.length === ind + 1 &&
                                    message.media.length % 3 === 1)
                                    ? 'xl:w-[476px] lg:w-[370px] w-[200px] h-[240px] xl:h-[430px] lg:h-[315px]'
                                    : 'xl:w-[235px] xl:h-[260px] lg:w-[183px] lg:h-[215px] w-[105px] h-[185px]'
                                }  rounded-md cursor-pointer`}
                                onClick={() =>
                                  setIsOpenImageModal({
                                    type: 'image',
                                    url: i.url
                                  })
                                }
                              />
                            </>
                          ) : (
                            <>
                              {isOpenImageModal.type === 'video' ? (
                                i.url === isOpenImageModal.url ? (
                                  <Modal
                                    isOpen={isOpenImageModal ? true : false}
                                  >
                                    <ImageModal
                                      type="video"
                                      setClose={() =>
                                        setIsOpenImageModal({
                                          type: '',
                                          url: ''
                                        })
                                      }
                                      isOpen={isOpenImageModal}
                                    />
                                  </Modal>
                                ) : null
                              ) : null}
                              <video
                                src={SERVER_URL_BASE + i.url}
                                width={476}
                                height={476}
                                controls
                                muted
                                className={`${
                                  (ind + 1) % 3 === 0 ||
                                  message.media.length === 1 ||
                                  (message.media.length === ind + 1 &&
                                    message.media.length % 3 === 1)
                                    ? 'xl:w-[476px] lg:w-[370px] w-[200px] h-[240px] xl:h-[430px] lg:h-[315px]'
                                    : 'xl:w-[235px] xl:h-[260px] lg:w-[183px] lg:h-[215px] w-[105px] h-[185px]'
                                } object-cover rounded-md cursor-pointer`}
                                onClick={() =>
                                  setIsOpenImageModal({
                                    type: 'video',
                                    url: i.url
                                  })
                                }
                              />
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex gap-2">
                <div
                  style={{
                    wordBreak: 'break-word'
                  }}
                >
                  {message.content}
                </div>
                <div className="text-[13px] text-gray flex mt-auto ml-auto">
                  <div className="text-xs mt-auto mr-1">
                    {message.isEdit ? 'изменено' : ''}
                  </div>
                  <div
                    className={`${isNotChannel ? 'mr-2' : 'gap-2'} flex mt-1`}
                  >
                    <div className="mt-auto">
                      {!isNotChannel && (
                        <div className="flex ">
                          <BsFillEyeFill className="my-auto mr-1" />
                          {formatViews(message.readChannels.length)}
                        </div>
                      )}
                    </div>
                    <div>
                      {timeCalc(
                        new Date(message.createdAt as string),
                        false,
                        true
                      )}
                    </div>
                  </div>
                  {isUserMessage && isNotChannel && (
                    <div className="mt-[5px]">
                      {message.isRead ? (
                        <IoCheckmarkDoneSharp className="text-white text-base " />
                      ) : (
                        <IoCheckmarkSharp className="text-white text-base " />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ChatMessage;
