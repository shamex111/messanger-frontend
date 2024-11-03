'use client';

import { useSendMutation } from '../../useSendMutation';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { GoX } from 'react-icons/go';
import { MdDeleteOutline } from 'react-icons/md';

import { SERVER_URL_BASE } from '@/config/api.config';

import { IFileForShort } from '@/types/file.types';

interface IMediaModal {
  media: IFileForShort[];
  setIsOpen: any;
  value: string;
  clearValue: any;
  handleSend:any
}

const MediaModal: FC<IMediaModal> = ({
  media,
  setIsOpen,
  value,
  clearValue,
  handleSend
}) => {
  const [content, setContent] = useState(value);
  const handleDelete = (m: IFileForShort) => {
    const updatedMedia = media.filter((i: IFileForShort) => i.url !== m.url);
    setIsOpen(updatedMedia);
  };

  useEffect(() => {
    clearValue('');
  }, [clearValue]);

  return (
    <div className="w-[33vw] mt-[10%] rounded-xl bg-main shadow-black drop-shadow-lg px-2 xl:max-h-[600px] lg:max-h-[450px] flex flex-col">
      <div className="flex gap-6 mx-6 pt-4">
        <GoX
          className="size-8 cursor-pointer text-gray"
          onClick={() => setIsOpen([])}
        />
        <div className="text-lg my-auto font-medium">Отправить Медиа</div>
      </div>
      <div
        className={`flex ${media.length === 1 ? 'justify-center' : 'grid grid-cols-2 gap-3'} mt-4 pr-1 overflow-y-auto xl:max-h-[80%] lg:max-h-[70%]`}
      >
        {media.map((m: IFileForShort) => {
          if (m.type === 'image') {
            return (
              <div key={m.url}>
                <div
                  className={`${media.length === 1 ? 'top-[93%] left-[93%]' : ''} m-0 px-[5px] py-[3px] relative w-fit top-[85%] left-[85%] hover:bg-red-500 duration-200 bg-gray bg-opacity-45 rounded-md`}
                  onClick={() => handleDelete(m)}
                >
                  <MdDeleteOutline className=" size-3 cursor-pointer m-0 p-0  " />
                </div>
                <Image
                  className={`${media.length === 1 ? 'w-[600px] h-[400px]' : 'w-[300px] h-[200px]'} rounded-lg`}
                  alt="media"
                  src={`${SERVER_URL_BASE}${m.url}`}
                  width={media.length === 1 ? 600 : 400}
                  height={media.length === 1 ? 300 : 300}
                />
              </div>
            );
          } else if (m.type === 'video') {
            return (
              <div key={m.url}>
                <div
                  className={`${media.length === 1 ? 'top-[93%] left-[93%]' : ''} m-0 px-[5px] py-[3px] relative w-fit top-[85%] left-[85%] hover:bg-red-500 duration-200 bg-gray bg-opacity-45 rounded-md z-50`}
                  onClick={() => handleDelete(m)}
                >
                  <MdDeleteOutline className=" size-3 cursor-pointer m-0 p-0  " />
                </div>
                <video
                  src={`${SERVER_URL_BASE}${m.url}`}
                  className={`${media.length === 1 ? 'w-[600px] h-[400px]' : 'w-[300px] h-[200px]'} rounded-lg object-cover`}
                  width={media.length === 1 ? 600 : 400}
                  height={media.length === 1 ? 300 : 300}
                  autoPlay
                  muted
                />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="mt-auto flex gap-2 py-3">
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Добавьте описание..."
          className="lg:w-[65%] xl:w-[75%] bg-transparent text-sm pl-2 outline-none border-none my-auto"
          maxLength={10000}
        />
        <button className="bg-accent rounded-md px-3 py-2 hover:opacity-80 xl:ml-auto" onClick={() => handleSend(content,true)}>
          Отправить
        </button>
      </div>
    </div>
  );
};

export default MediaModal;
