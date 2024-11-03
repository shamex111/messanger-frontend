'use client';

import Image from 'next/image';
import { FC } from 'react';
import {
  BiMessageSquareMinus,
  BiMessageX,
  BiSolidMessageSquareAdd
} from 'react-icons/bi';
import { CgBlock } from 'react-icons/cg';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { MdDeleteOutline } from 'react-icons/md';

import { SERVER_URL_BASE } from '@/config/api.config';

import { IGroup } from '@/types/group.types';

import { useChangeDiscussion } from './ChangeDiscussion';

interface IDiscussionModule {
  setModuleType: any;
  discussion: IGroup | null;
  channelId: number;
}

const DiscussionModule: FC<IDiscussionModule> = ({
  setModuleType,
  discussion,
  channelId
}) => {
  const { mutate } = useChangeDiscussion();
  const handleChangeDiscussion = (action: 'create' | 'delete') => {
    mutate({ channelId: channelId, action: action });
  };
  return (
    <div>
      <div className="flex gap-10 ml-7 mt-4 mb-3">
        <FaArrowLeftLong
          className="size-6 my-auto text-gray cursor-pointer"
          onClick={() => setModuleType('main')}
        />
        <div className="text-xl font-semibold">Настройки обсуждения</div>
      </div>
      <div>
        {discussion ? (
          <div>
            <div className="flex gap-3 mt-10 px-4">
              <Image
                src={SERVER_URL_BASE + discussion.avatar}
                alt="av"
                width={40}
                height={40}
                className="w-[40px] h-[40px] rounded-full"
              />
              <div className="flex flex-col">
                <div className="font-medium">{discussion?.name}</div>
                <div className="text-sm font-medium text-gray ">Группа</div>
              </div>
            </div>
            <div
              className="flex gap-7 px-3 mt-4 py-[14px] cursor-pointer w-[95%] mx-auto hover:bg-secondary  rounded-lg"
              onClick={() => handleChangeDiscussion('delete')}
            >
              <MdDeleteOutline className="size-6 text-red-600" />
              <div className="text-[15px] text-red-600">Удалить обсуждение</div>
            </div>
            <div className="w-full bg-secondary h-3 my-4"></div>
            <div className=" mt-2 text-gray ml-3 text-[15px]">
              У вас уже создано обсуждение для канала{' '}
            </div>
          </div>
        ) : (
          <div className="flex flex-col mt-6">
            {/* <CgBlock className="size-60 mx-auto text-gray" /> */}
            <BiMessageX className="size-48 mx-auto text-gray" />
            <div className="mx-auto w-fit relative bottom-2 text-gray font-semibold">
              Для вашего канала пока нет обсуждения
            </div>
            <button
              className="w-[250px] mt-8 py-[6px] rounded-md mx-auto bg-accent text-white hover:shadow-lg duration-200  hover:shadow-accent"
              onClick={() => handleChangeDiscussion('create')}
            >
              Создать обсуждение
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionModule;
