import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { FC } from 'react';
import { IoExitOutline } from 'react-icons/io5';
import { MdAlternateEmail } from 'react-icons/md';
import { RxText } from 'react-icons/rx';
import { TbPointFilled } from 'react-icons/tb';

import { SERVER_URL_BASE } from '@/config/api.config';

import { removeFromStorage } from '@/services/auth/auth-token.service';

import { IUser } from '@/types/user.types';

import { timeCalc } from '@/utils/timeCalc';

import styles from './InfoSettings.module.scss';

interface IInfoSettings {
  user: IUser;
}

const InfoSettings: FC<IInfoSettings> = observer(({ user }) => {
  const logout = () => {
    removeFromStorage();
    window.location.assign('/');
  };

  return (
    <div
      className="flex flex-col justify-between"
      style={{
        height: 'calc(100vh - 71px)'
      }}
    >
      <div>
        <div className="xl:h-[370px] lg:h-[320px] ">
          <Image
            src={`${SERVER_URL_BASE}${user.avatar}`}
            alt="avatar"
            width={370}
            height={370}
            className={styles.userImage}
          />
          <div>
            {user.isOnline ? (
              <TbPointFilled
                color="#0ac630"
                className="absolute xl:mt-[316px] lg:mt-[260px] ml-2 font-semibold text-xl  "
              />
            ) : null}
            <div className="absolute lg:mt-[254px] xl:mt-[310px] font-semibold text-xl ml-8 shadow-sm ">
              {user.name}
            </div>
            <div className="absolute lg:mt-[277px] xl:mt-[330px] text-sm font-medium text-[#b7b7b7] ml-8 ">
              {user.isOnline && 'В сети'}
              {!user.isOnline &&
                'Был(а) ' + timeCalc(new Date(user.lastOnline), true)}
            </div>
          </div>
        </div>
        <div className="mt-[5px] ml-[20px] flex flex-col gap-[17px]">
          <div className="flex">
            <MdAlternateEmail className="text-3xl text-[#666666] my-auto" />
            <div className="ml-[33px]">
              <p className="text-[16px]">{user.username}</p>
              <p className="text-[14px] text-[#A6A6A6] ">Имя пользователя</p>
            </div>
          </div>
          <div className="flex">
            <RxText className="text-3xl text-[#666666] my-auto" />
            <div className="ml-[33px]">
              <p className="text-[14px] ">
                {user.description ? user.description : 'Описание остутствует'}
              </p>
              <p className="text-[14px] text-[#A6A6A6] ">Описание</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-auto pt-3 pl-[20px] flex gap-[20px] w-full border-t-2 border-border">
        <IoExitOutline
          color="red"
          className="my-auto text-4xl cursor-pointer"
          onClick={() => logout()}
        />
        <p className="my-auto cursor-pointer" onClick={() => logout()}>
          Выйти
        </p>
      </div>
    </div>
  );
});

export default InfoSettings;
