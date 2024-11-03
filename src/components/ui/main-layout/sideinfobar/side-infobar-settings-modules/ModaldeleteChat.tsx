import Image from 'next/image';
import { FC, useEffect } from 'react';

import { SERVER_URL_BASE } from '@/config/api.config';


interface IModalDelete {
  setIsOpen: any;
  image: string;
  name: string;
  type: 'group' | 'channel';
  deleteChat: any;
}

const ModalDelete: FC<IModalDelete> = ({
  setIsOpen,
  image,
  type,
  name,
  deleteChat
}) => {
  const handleClick = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="xl:w-[20vw] lg:w-[30vw] mt-[10%] rounded-xl bg-main shadow-black drop-shadow-lg px-2 xl:max-h-[600px] lg:max-h-[450px] flex flex-col gap-3">
      <div className="flex flex-col gap-4 mt-4 ml-4">
        <div className="flex gap-4">
          <Image
            src={SERVER_URL_BASE + image}
            alt={name}
            width={33}
            height={33}
            className="w-[33px] h-[33px] rounded-full"
          />
          <div className="lg:font-medium xl:font-semibold my-auto lg:text-lg xl:text-xl">
            {`Удалить ${type === 'channel' ? 'канал' : 'группу'}`}
          </div>
        </div>
        <div className="text-[15px] max-w-[95%]">
          Вы уверенны, что хотите
          {` удалить ${type === 'channel' ? 'канал' : 'группу'} `}
          <span className="font-medium">{name}</span>?
        </div>
      </div>
      <div className="flex flex-col gap-2 ml-auto mr-4 pb-5">
        <button
          className="w-fit ml-auto text-[#e53935] font-medium text-lg hover:bg-[#e53935] rounded-md px-2 py-1 hover:bg-opacity-10 duration-100"
          onClick={() => deleteChat()}
        >
          {`Удалить ${type === 'channel' ? 'канал' : 'группу'}`}
        </button>
        <button
          className="w-fit ml-auto text-accent font-medium text-lg hover:bg-accent  rounded-md px-2 py-1 hover:bg-opacity-10 duration-100"
          onClick={() => setIsOpen(false)}
        >
          Отмена
        </button>
      </div>
    </div>
  );
};

export default ModalDelete;
