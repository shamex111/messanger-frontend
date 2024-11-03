import Modal from '../typing-area/Modal/Modal';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { FC, useState } from 'react';
import CountUp from 'react-countup';
import { CgMenuRight } from 'react-icons/cg';
import { RiUserAddLine } from 'react-icons/ri';

import { useStores } from '@/components/ui/chatStoreProvider';

import { SERVER_URL_BASE } from '@/config/api.config';

import { permissionsVariant } from '@/types/permissions.enum';

import { timeCalc } from '@/utils/timeCalc';
import { userEndFormat } from '@/utils/usersEndFormat';

import AddMembersModal from './AddMembersModal';
import style from './MainTopInfoBar.module.scss';
import { BsVolumeMuteFill } from 'react-icons/bs';

interface IMainTopInfoBar {
  name: string;
  qtyUsers?: number;
  lastOnline?: any;
  isOnline?: boolean;
  smthId: number;
  type: 'channel' | 'group' | 'chat';
  avatar: string;
  isInfoBarOpen: boolean;
  setIsInfoBarOpen: any;
  isPreview?: boolean;
}

const MainTopInfoBar: FC<IMainTopInfoBar> = observer(
  ({
    name,
    qtyUsers,
    lastOnline,
    smthId,
    isOnline,
    type,
    avatar,
    isInfoBarOpen,
    setIsInfoBarOpen,
    isPreview
  }) => {
    const { userStore } = useStores();
    const [isOpen, setIsOpen] = useState(false);
    let member: any;
    if (type === 'channel') {
      member = userStore.user?.channelMembers?.find(
        i => i.channelId === smthId
      );
    } else if (type === 'group') {
      member = userStore.user?.groupMembers?.find(i => i.groupId === smthId);
    }
    return (
      <header className={style.wrapper}>
        {isOpen ? (
          <Modal isOpen={isOpen}>
            <AddMembersModal
              setIsOpen={setIsOpen}
              type={type as 'channel' | 'group'}
              smthId={smthId}
            />
          </Modal>
        ) : null}
        <div className={style.leftBar}>
          <Image
            src={SERVER_URL_BASE + avatar}
            alt="Автарка"
            width={42}
            height={42}
            className="h-[42px] w-[42px] rounded-full "
          />
          <div>
            <div className='flex gap-2'>
            <h3
              onClick={() => setIsInfoBarOpen(!isInfoBarOpen)}
              className="cursor-pointer"
            >
              {name}
            </h3>{' '}
            {member?.isMuted ? (
              <BsVolumeMuteFill className="text-gray size-[15px] my-auto" />
            ) : null}</div>
            <p>
              {type === 'chat' ? (
                isOnline ? (
                  'В сети'
                ) : (
                  'Был(а) в сети ' + timeCalc(new Date(lastOnline), true)
                )
              ) : (
                <div>
                  {userEndFormat(
                    qtyUsers as number,
                    type === 'channel' ? 'channel' : 'group'
                  )}
                </div>
              )}
            </p>
          </div>
        </div>
        <div className={style.rightBar}>
          {!isPreview &&
          (type === 'chat'
            ? null
            : type === 'group'
              ? userStore.user?.groupMembers
                  ?.find(i => i.groupId === smthId)
                  ?.groupRole.permissions.find(
                    i => i.permission.action === permissionsVariant.addMember
                  )
              : type === 'channel'
                ? type === 'channel'
                  ? userStore.user?.channelMembers
                      ?.find(i => i.channelId === smthId)
                      ?.channelRole.permissions.find(
                        i =>
                          i.permission.action === permissionsVariant.addMember
                      )
                  : null
                : null) ? (
            <div onClick={() => setIsOpen(true)}>
              <RiUserAddLine className="my-auto h-fit" />
            </div>
          ) : null}

          <div
            className={isInfoBarOpen ? style.active : undefined}
            onClick={() => setIsInfoBarOpen(!isInfoBarOpen)}
          >
            <CgMenuRight className="my-auto h-fit" />
          </div>
        </div>
      </header>
    );
  }
);

export default MainTopInfoBar;
