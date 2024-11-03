import { useInviteContext } from '../../../main/inviteChat/InviteProvider';
import { TSearchType } from '../SearchSideBar';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { useStores } from '@/components/ui/chatStoreProvider';

import { SERVER_URL_BASE } from '@/config/api.config';
import { PUBLIC_URl } from '@/config/url.config';

import chatService from '@/services/chat.service';

import { timeCalc } from '@/utils/timeCalc';
import { userEndFormat } from '@/utils/usersEndFormat';

import { useCreateChatMutation } from './useCreateChatMutation';

interface ISearchSideBarItem {
  name: string;
  avatar: string;
  qtyUsers?: number;
  lastOnline?: any;
  type: TSearchType;
  smthId: number;
  setIsSearch: any;
}

const SearchSideBarItem: FC<ISearchSideBarItem> = observer(
  ({ avatar, name, qtyUsers, lastOnline, type, smthId, setIsSearch }) => {
    const { push } = useRouter();
    const { mutate } = useCreateChatMutation();
    const { chatStore, userStore } = useStores();
    const { data, setData } = useInviteContext();

    const updateInvite = (type: 'channel' | 'group', id: number) => {
      setData({ type, id, isDiscussion: false });
    };

    const handleChat = async () => {
      if (type === 'Пользователи') {
        const chat = chatStore.allChats.find(
          i =>
            i.type === 'chat' && (i.user1Id === smthId || i.user2Id === smthId)
        );
        if (chat) {
          push(`/chat/${chat.id}`);
          setIsSearch(false);
        } else {
          mutate(
            {
              data: {
                user1Id: userStore?.user?.id as number,
                user2Id: smthId
              },
              type: 'chat'
            },
            {
              onSuccess: () => {
                const chat = chatStore.allChats.find(
                  i =>
                    i.type === 'chat' &&
                    (i.user1Id === smthId || i.user2Id === smthId)
                );
                if (chat) {
                  push(`/chat/${chat.id}`);
                }
                setIsSearch(false);
              }
            }
          );
        }
      } else if (type === 'Группы') {
        const chat = chatStore.allChats.find(
          i => i.type === 'group' && i.id === smthId
        );
        if (chat) {
          push(`/group/${smthId}`);
          setIsSearch(false);
        } else {
          updateInvite('group', smthId);
          push(`/invite`);
        }
      } else if (type === 'Каналы') {
        const chat = chatStore.allChats.find(
          i => i.type === 'channel' && i.id === smthId
        );
        if (chat) {
          push(`/channel/${smthId}`);
          setIsSearch(false);
        } else {
          updateInvite('channel', smthId);
          push(`/invite`);
        }
      }
    };

    return (
      <div
        className="flex ml-2 pl-3 mr-2 lg:py-1 px-2 xl:py-2 rounded-xl h-[64px] gap-3 hover:bg-gray hover:bg-opacity-35 cursor-pointer"
        onClick={() => handleChat()}
      >
        <Image
          src={SERVER_URL_BASE + avatar}
          alt="Аватарка"
          width={50}
          height={50}
          className="rounded-full xl:w-[50px] xl:h-[50px] w-[35px] h-[35px] lg:w-[40px] lg:h-[40px] my-auto"
        />
        <div className="flex flex-col xl:justify-between my-auto">
          <div className="lg:text-base xl:font-medium text-base">
            {name.slice(0, 15)}
          </div>
          <div className="text-gray lg:text-[14px] xl:text-[15px] text-[13px]">
            {lastOnline
              ? lastOnline === 'В сети'
                ? 'В сети'
                : timeCalc(new Date(lastOnline), true)
              : userEndFormat(qtyUsers as number)}
          </div>
        </div>
      </div>
    );
  }
);
export default SearchSideBarItem;
