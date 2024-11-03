'use client';

import { useStores } from '../../chatStoreProvider';
import { useEdit } from '../main/chat/EditProvider';
import ImageModal from '../main/chat/chat-messages/ImageModal';
import { useInviteContext } from '../main/inviteChat/InviteProvider';
import Modal from '../main/typing-area/Modal/Modal';
import { useCreateChatMutation } from '../sidebar/search-side-bar/searchSideBarItem/useCreateChatMutation';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import { SERVER_URL_BASE } from '@/config/api.config';

import { IChannel, IChannelMember } from '@/types/channel.types';
import { IChat } from '@/types/chat.types';
import { IGroup, IGroupMember } from '@/types/group.types';
import { IAttachment } from '@/types/message.types';

import { timeCalc } from '@/utils/timeCalc';

interface ISideInfoBarLists {
  chat: IChannel | IGroup | IChat;
}

const SideInfoBarLists: FC<ISideInfoBarLists> = ({ chat }) => {
  const { userStore, chatStore } = useStores();
  const [contentType, setContentType] = useState<'media' | 'users'>(
    chat.type !== 'group' ? 'media' : 'users'
  );
  const [countUsers, setCountUsers] = useState(10);
  const [countMedia, setCountMedia] = useState(30);
  const [isOpenImageModal, setIsOpenImageModal] = useState<{
    type: '' | 'image' | 'video';
    url: string;
  }>({ type: '', url: '' });
  const { isEditMessageId, setIsEdit } = useEdit();
  const { mutate: createChatMutation } = useCreateChatMutation();

  const { data, setData } = useInviteContext();
  const { push } = useRouter();
  const handleChat = async (id: number) => {
    const chat = chatStore.allChats.find(
      i => i.type === 'chat' && (i.user1Id === id || i.user2Id === id)
    );
    if (chat) {
      push(`/chat/${chat.id}`);
    } else {
      createChatMutation(
        {
          data: {
            user1Id: userStore?.user?.id as number,
            user2Id: id
          },
          type: 'chat'
        },
        {
          onSuccess: () => {
            const chat = chatStore.allChats.find(
              i => i.type === 'chat' && (i.user1Id === id || i.user2Id === id)
            );
            if (chat) {
              push(`/chat/${chat.id}`);
            }
          }
        }
      );
    }
  };
  return (
    <div className="flex flex-col">
      {
        <div className="flex justify-around border-b-2 border-border ">
          {chat.type === 'group' ? (
            <div
              className={`cursor-pointer hover:bg-gray rounded-t-md hover:bg-opacity-15 p-1 px-2 ${contentType === 'users' ? 'text-accent border-b-[3px] rounded-sm border-accent' : ''}`}
              onClick={() => setContentType('users')}
            >
              Участники
            </div>
          ) : null}
          <div
            className={`cursor-pointer hover:bg-gray rounded-t-md hover:bg-opacity-15 p-1 px-2  ${contentType === 'media' ? 'text-accent border-b-[3px] rounded-sm border-accent' : ''}`}
            onClick={() => setContentType('media')}
          >
            Медиа
          </div>
        </div>
      }
      <div>
        {contentType === 'users' ? (
          <div>
            <div className="flex flex-col mt-2">
              {(chat as IGroup)?.members?.slice(0, countUsers).map(i => (
                <div key={i.id} className="mx-3 ">
                  <div
                    className="flex gap-3 py-2 px-4 hover:bg-gray  hover:bg-opacity-15 rounded-md cursor-pointer"
                    onClick={
                      i.user.id === userStore.user?.id
                        ? () => null
                        : () => handleChat(i.user.id)
                    }
                  >
                    <Image
                      src={SERVER_URL_BASE + i.user.avatar}
                      alt="av"
                      width={40}
                      height={40}
                      className="w-[40px] h-[40px] rounded-full"
                    />
                    <div className="flex flex-col">
                      <div className="flex w-max justify-between gap-2  ">
                        <div className="font-medium ">
                          {i.user?.name}{' '}
                          {i.user.id === userStore.user?.id ? (
                            <span className="text-gray text-sm">вы</span>
                          ) : (
                            ''
                          )}
                        </div>
                        <div className="text-sm my-auto ">
                          {!(
                            (i as IGroupMember).groupRole.isSystemRole &&
                            (i as IGroupMember).groupRole.name === 'Участник'
                          ) ? (
                            <div
                              className=""
                              style={{
                                color: (i as IGroupMember).groupRole.color
                              }}
                            >
                              {(i as IGroupMember).groupRole.name}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray ">
                        {i.user.isOnline
                          ? 'В сети'
                          : 'Был(а) в сети ' +
                            timeCalc(new Date(i.user.lastOnline), true)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(chat as IGroup)?.qtyUsers > countUsers ? (
              <div
                className="text-accent ml-auto w-fit mr-5 mt-2 text-sm cursor-pointer"
                onClick={() => setCountUsers(countUsers + 10)}
              >
                Показать еще...
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap gap-[2px] mx-auto">
              {[...(chat?.media as Array<IAttachment>)]
                .reverse()
                .slice(0, countMedia)
                .map(i => (
                  <div key={i.id}>
                    {i.type === 'image' ? (
                      <>
                        {isOpenImageModal.type === 'image' ? (
                          i.url === isOpenImageModal.url ? (
                            <Modal isOpen={isOpenImageModal ? true : false}>
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
                          onClick={() =>
                            setIsOpenImageModal({
                              type: 'image',
                              url: i.url
                            })
                          }
                          src={SERVER_URL_BASE + i.url}
                          alt="i"
                          width={300}
                          height={300}
                          className="xl:w-[133px] xl:h-[133px] lg:w-[107px] lg:h-[107px] cursor-pointer"
                        />
                      </>
                    ) : (
                      <>
                        {isOpenImageModal.type === 'video' ? (
                          i.url === isOpenImageModal.url ? (
                            <Modal isOpen={isOpenImageModal ? true : false}>
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
                          className="xl:w-[133px] xl:h-[133px] lg:w-[107px] lg:h-[107px] object-cover cursor-pointer"
                          onClick={() =>
                            setIsOpenImageModal({
                              type: 'video',
                              url: i.url
                            })
                          }
                        ></video>
                      </>
                    )}
                  </div>
                ))}
              {(chat?.media?.length as number) > countMedia ? (
                <div
                  className="text-accent ml-auto w-fit mr-5 mt-2 text-sm cursor-pointer"
                  onClick={() => setCountMedia(countMedia + 50)}
                >
                  Показать еще...
                </div>
              ) : null}
              {chat?.media?.length == 0 ? (
                <div className="text-sm font-medium text-gray mt-2 ml-4">
                  Медиа нет
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideInfoBarLists;
