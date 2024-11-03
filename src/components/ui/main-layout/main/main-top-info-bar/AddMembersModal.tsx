import Image from 'next/image';
import { FC, useState } from 'react';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { GoX } from 'react-icons/go';

import { useStores } from '@/components/ui/chatStoreProvider';

import { SERVER_URL_BASE } from '@/config/api.config';

import { IChat } from '@/types/chat.types';
import { IUser } from '@/types/user.types';

import { timeCalc } from '@/utils/timeCalc';

import styles from './AddMember.module.scss';
import addMemberMutate from './addMemberMutate';

interface IAddMembersModal {
  setIsOpen: any;
  type: 'channel' | 'group';
  smthId: number;
}

const AddMembersModal: FC<IAddMembersModal> = ({ setIsOpen, smthId, type }) => {
  const { chatStore, userStore } = useStores();
  const chats = chatStore.allChats.filter(chat => chat.type === 'chat');
  let users = chats?.map((chat: IChat) =>
    chat.user1.id === userStore.user?.id ? chat.user2 : chat.user1
  );
  const chat = chatStore.allChats.find(i => i.type === type && i.id === smthId);
  users = users.filter(i => {
    return !chat.members.find((o: any) => o.userId === i.id);
  });

  const { mutate } = addMemberMutate();
  const [usersData, setUsersData] = useState<any[]>([]);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    data: { id: number; name: string; avatar: string }
  ) => {
    if (e.target.checked) {
      setUsersData([...usersData, data]);
    } else {
      clearUserFromData(data.id);
    }
  };

  const clearUserFromData = (id: number) => {
    setUsersData(usersData.filter(i => i.id !== id));
  };
  const handleSubmit = () => {
    usersData.forEach(i => {
      return mutate({ userId: i.id, smthId: smthId, type: type });
    });
    setIsOpen(false);
  };

  return (
    <div className="xl:w-[25vw] lg:w-[30vw] rounded-xl bg-main shadow-black drop-shadow-lg px-4 xl:max-h-[600px] lg:max-h-[450px] overflow-y-auto flex flex-col gap-3 pb-5">
      <div className="flex flex-col">
        <div className="my-4 flex gap-4 mx-2 cursor-pointer">
          <FaArrowLeftLong
            className="size-5 text-gray my-auto"
            onClick={() => setIsOpen(false)}
          />
          <div className="text-lg font-semibold">Добавить пользователей</div>
        </div>
        <div className="flex flex-wrap">
          {usersData.length
            ? usersData.map((i, ind) => (
                <div
                  key={i.id}
                  className={`flex mb-2 cursor-pointer relative${
                    ind > 0 ? 'relative ' : ''
                  } `}
                >
                  <div className="flex">
                    <Image
                      src={SERVER_URL_BASE + i.avatar}
                      alt="av"
                      width={30}
                      height={30}
                      className="w-[30px] h-[30px] rounded-full my-auto z-20"
                    />
                    <div
                      className="relative right-[30px] z-20 my-auto w-[30px] h-[30px] rounded-full bg-red-600 bg-opacity-0 hover:bg-opacity-100 duration-300 flex"
                      onClick={() => clearUserFromData(i.id)}
                    >
                      <GoX className="m-auto size-5 opacity-0 hover:opacity-100 duration-300 w-[30px] h-[30px]" />
                    </div>
                  </div>
                  <div className="my-auto rounded-md bg-gray right-[42px] bg-opacity-20 text-sm font-light relative py-[2px] pl-4 pr-2 min-w-[82.05px]">
                    {i.name?.slice(0, 7)}
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
      {users.length ? (
        <div className='flex flex-col gap-3'>
          {users.map((user: IUser) => (
            <div key={user.id} className="flex gap-4 mx-2">
              <Image
                src={SERVER_URL_BASE + user.avatar}
                alt="картинка"
                width={40}
                height={40}
                className="w-[40px] h-[40px] rounded-full my-auto"
              />
              <div>
                <div>{user.name}</div>
                <div className="text-gray text-xs ">
                  {user.isOnline
                    ? 'В сети'
                    : `Был(а) в сети ${timeCalc(new Date(user.lastOnline), true)}`}
                </div>
              </div>
              <div className="ml-auto my-auto">
                <input
                  type="checkbox"
                  checked={!!usersData.find(i => i.id === user.id)}
                  onChange={e =>
                    handleCheckboxChange(e, {
                      id: user.id,
                      name: user.name,
                      avatar: user.avatar
                    })
                  }
                  className={`ml-auto my-auto ${styles.checkboxCustom}`}
                />
              </div>
            </div>
          ))}
          {usersData.length ? (
            <button
              className="lg:w-[45px] xl:w-[50px] xl:h-[50px] bg-accent lg:h-[45px] rounded-full flex ml-auto mr-4  xl:my-5 lg:my-3 hover:bg-opacity-85 xl:mt-6 p-auto hover:pl-4 active:pl-5 duration-150"
              onClick={() => handleSubmit()}
            >
              <FaArrowRightLong className=" lg:size-4 xl:size-5 m-auto text-white ml-5" />
            </button>
          ) : null}
        </div>
      ) : (
        <div className="w-fit h-fit mx-auto rounded-md text-sm mb-2 px-2 py-1 bg-slate-700 bg-opacity-45">
          У вас нет пользователей для добавления
        </div>
      )}
    </div>
  );
};

export default AddMembersModal;
