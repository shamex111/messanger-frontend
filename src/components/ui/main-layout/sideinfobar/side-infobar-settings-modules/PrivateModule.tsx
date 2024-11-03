'use client';

import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';

import { useStores } from '@/components/ui/chatStoreProvider';

import { IChannel } from '@/types/channel.types';
import { IGroup } from '@/types/group.types';

import styleForCheckBox from './checkbox.module.scss';
import { useEditChatMutation } from './useEditChatMutation';

interface IPrivateModule {
  setModuleType: any;
  type: 'channel' | 'group';
  defaultValue: boolean;
  chat: IChannel | IGroup;
}

const PrivateModule: FC<IPrivateModule> = ({
  setModuleType,
  type,
  defaultValue,
  chat
}) => {
  const [isPrivate, setIsPrivate] = useState<boolean>(defaultValue);
  const { mutate } = useEditChatMutation();
  const { chatStore } = useStores();
  const handleSubmit = () => {
    return mutate(
      {
        data: {
          name: chat.name,
          description: chat.description,
          private: isPrivate,
          avatar: chat.avatar,
          channelId: chat.type === 'channel' ? chat.id : null,
          groupId: chat.type === 'group' ? chat.id : null
        },
        type
      },
      {
        onSuccess: () => {
          toast.success(
            `Тип ${type === 'channel' ? 'канала' : 'группы'} изменен!`
          );
          chatStore.editChat({
            smthId: chat.id as number,
            type: chat.type as 'group' | 'channel',
            newData: {
              private: isPrivate
            }
          });
          setModuleType('main');
        }
      }
    );
  };
  return (
    <div>
      <div className="flex gap-10 ml-7 mt-4 mb-3">
        <FaArrowLeftLong
          className="size-6 my-auto text-gray cursor-pointer"
          onClick={() => setModuleType('main')}
        />
        <div className="text-xl font-semibold">
          Тип {type === 'channel' ? 'канала' : 'группы'}
        </div>
      </div>
      <div className="mt-7 px-2">
        <div className="text-gray text-base font-medium">
          Тип {type === 'channel' ? 'канала' : 'группы'}
        </div>
        <div className="flex flex-col gap-5 mt-4 px-5 ">
          <div className="flex gap-7">
            <div className="h-fit my-auto">
              <label className={`${styleForCheckBox.switch}`}>
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={e => (e.target.checked ? setIsPrivate(true) : null)}
                />
                <span className={styleForCheckBox.slider}></span>
              </label>
            </div>
            <div className="flex flex-col my-auto">
              <div>
                {type === 'channel' ? 'Приватный канал' : 'Приватная группа'}
              </div>
              <div className="text-gray text-sm">
                В {type === 'channel' ? 'приватном канале' : 'приватной группе'}{' '}
                пользователи могут вступить только с помощью добавления кем-либо
                из участников с правом на добавление участников.
              </div>
            </div>
          </div>
          <div className="flex gap-7">
            <div className="h-fit my-auto">
              <label className={styleForCheckBox.switch}>
                <input
                  type="checkbox"
                  checked={!isPrivate}
                  onChange={e =>
                    e.target.checked ? setIsPrivate(false) : null
                  }
                  className="my-auto"
                />
                <span className={styleForCheckBox.slider}></span>
              </label>
            </div>
            <div className="flex flex-col my-auto">
              <div>
                {type === 'channel' ? 'Публчиный канал' : 'Публичная группа'}
              </div>
              <div className="text-gray text-sm">
                В {type === 'channel' ? 'публичном канале' : 'публичной группе'}{' '}
                пользователи могут вступать свободно без приглашений.
              </div>
            </div>
          </div>
        </div>
      </div>
      {isPrivate !== defaultValue ? (
        <button
          type="submit"
          className="relative  z-20 lg:w-[50px] xl:w-[60px] xl:h-[60px] bg-accent lg:h-[50px] rounded-full flex ml-auto mr-4  xl:my-5 lg:my-3 hover:bg-opacity-85 xl:mt-6 p-auto hover:pl-6 active:pl-8 duration-150"
          onClick={() => handleSubmit()}
        >
          <FaArrowRightLong className=" lg:size-4 xl:size-5 m-auto text-white ml-5" />
        </button>
      ) : null}
    </div>
  );
};

export default PrivateModule;
