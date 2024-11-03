import Modal from '../../main/typing-area/Modal/Modal';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { FC, useState } from 'react';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { MdDeleteOutline, MdModeEditOutline } from 'react-icons/md';

import { useStores } from '@/components/ui/chatStoreProvider';

import { SERVER_URL_BASE } from '@/config/api.config';

import { IChannel, IChannelMember, IChannelRole } from '@/types/channel.types';
import { IGroup, IGroupMember, IGroupRole } from '@/types/group.types';

import { timeCalc } from '@/utils/timeCalc';

import ModalMemberDelete from './ModalDeleteMember';
import styleForCheckBox from './checkbox.module.scss';
import { useDeleteMemberMutation } from './useDeleteMemberMutation';
import { useEditMemberMutation } from './useEditMemberMutation';

interface IMembersModule {
  setModuleType: any;
  chat: IChannel | IGroup;
}

const MembersModule: FC<IMembersModule> = observer(
  ({ setModuleType, chat }) => {
    const { userStore } = useStores();
    const [searchTerm, setSearchTerm] = useState('');
    let members: any = chat?.members;
    const [newMemberRoleName, setNewMemberRoleName] = useState('');
    if (searchTerm) {
      members = members?.filter((i: any) =>
        i.user.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
    }
    const [rolesSearchTerm, setRolesSearchTerm] = useState<string>('');
    let roles = chat?.roles;
    if (rolesSearchTerm) {
      roles = roles?.filter((i: any) =>
        i.name.toLowerCase().startsWith(rolesSearchTerm.toLowerCase())
      );
    }
    const [isDeleteOpen, setIsDeleteOpen] = useState<{
      id: number;
      name: string;
      isOpen: boolean;
    }>({ id: 0, name: '', isOpen: false });

    const [isEdit, setIsEdit] = useState<{ isOpen: boolean; id: number }>({
      isOpen: false,
      id: 0
    });

    const { mutate } = useDeleteMemberMutation();
    const handleDeleteMember = (id: number) => {
      if (chat.type === 'channel') {
        mutate({
          type: 'channel',
          data: { userId: id, channelId: chat.id }
        });
      } else {
        mutate({
          type: 'group',
          data: { groupId: chat.id, userId: id }
        });
      }
    };
    const { mutate: editMemberMutate } = useEditMemberMutation();
    if (isEdit.isOpen) {
      let member;
      let roleName: any;
      if (chat.type === 'channel') {
        member = (chat as IChannel).members?.find(i => i.user.id === isEdit.id);
        roleName = member?.channelRole.name;
      } else if (chat.type === 'group') {
        member = (chat as IGroup).members?.find(i => i.user.id === isEdit.id);
        roleName = member?.groupRole.name;
      }

      if (!newMemberRoleName) {
        setNewMemberRoleName(roleName);
      }
      
      const handleEditMember = () => {
        if (chat.type === 'channel') {
          editMemberMutate({
            type: 'channel',
            data: {
              userId: isEdit.id,
              channelId: chat.id,
              roleName: newMemberRoleName
            }
          });
        } else {
          editMemberMutate({
            type: 'group',
            data: {
              userId: isEdit.id,
              groupId: chat.id,
              roleName: newMemberRoleName
            }
          });
        }
        setNewMemberRoleName('');
        setIsEdit({ isOpen: false, id: 0 });
        
      };
      return (
        <div>
          <div className="flex gap-10 ml-7 mt-4 mb-3">
            <FaArrowLeftLong
              className="size-6 my-auto text-gray cursor-pointer"
              onClick={() => {
                setIsEdit({ isOpen: false, id: 0 });
                setNewMemberRoleName('');
              }}
            />
            <div className="text-xl font-semibold">Редакт. пользователя</div>
          </div>
          <div className="flex gap-4 h-fit px-6 mt-4">
            <Image
              src={SERVER_URL_BASE + member?.user.avatar}
              alt="av"
              width={40}
              height={40}
              className="w-[40px] h-[40px] rounded-full my-auto "
            />
            <div className="flex flex-col">
              <div className="font-medium">{member?.user.name}</div>
              <div className="text-gray">Редактирование</div>
            </div>
          </div>{' '}
          <input
            type="text"
            value={rolesSearchTerm}
            onChange={e => setRolesSearchTerm(e.target.value)}
            placeholder="Найти роль..."
            className="bg-transparent border-border border-2 rounded-md ml-7 pl-2 outline-none py-2 my-3 focus-visible:border-accent"
          />
          <div>
            {roles?.map((i: IChannelRole | IGroupRole) => (
              <>
                <div
                  key={i.id}
                  className="flex px-3 py-[10px] cursor-pointer rounded-lg gap-3"
                >
                  <div
                    className="w-[6px] h-[6px] rounded-full my-auto"
                    style={{ backgroundColor: i.color }}
                  ></div>
                  <div style={{ color: i.color }}>{i.name}</div>
                  <div className="flex gap-2 ml-auto mr-4"></div>
                  <label
                    className={`${styleForCheckBox.switch} ml-auto mr-4 my-auto `}
                  >
                    <input
                      type="checkbox"
                      checked={i.name === newMemberRoleName}
                      onChange={() => setNewMemberRoleName(i.name)}
                    />
                    <span className={styleForCheckBox.slider}></span>
                  </label>
                </div>
              </>
            ))}
            {roles?.length === 0 ? (
              <div className="text-gray ml-2">
                Ролей с таким именем несуществует.
              </div>
            ) : null}
          </div>
          <button
            type="submit"
            className="absolute top-[85vh] left-[100vw] lg:right-[230px] xl:right-[250px] z-20 lg:w-[50px] xl:w-[60px] xl:h-[60px] bg-accent lg:h-[50px] rounded-full flex ml-auto mr-4  xl:my-5 lg:my-3 hover:bg-opacity-85 xl:mt-6 p-auto hover:pl-6 active:pl-8 duration-150"
            onClick={() => {
              setIsEdit({
                isOpen: false,
                id: 0
              });
              handleEditMember();
            }}
          >
            <FaArrowRightLong className=" lg:size-4 xl:size-5 m-auto text-white ml-5" />
          </button>
        </div>
      );
    }
    return (
      <div>
        {isDeleteOpen ? (
          <Modal isOpen={isDeleteOpen.isOpen}>
            <ModalMemberDelete
              id={isDeleteOpen.id}
              setIsOpen={setIsDeleteOpen}
              name={isDeleteOpen.name}
              deleteRole={handleDeleteMember}
            ></ModalMemberDelete>
          </Modal>
        ) : null}
        <div className="flex gap-10 ml-7 mt-4 mb-3">
          <FaArrowLeftLong
            className="size-6 my-auto text-gray cursor-pointer"
            onClick={() => setModuleType('main')}
          />
          <div className="text-xl font-semibold">
            {chat.type === 'channel' ? 'Подписчики канала' : 'Участники группы'}
            <span className="text-base ml-2 text-gray my-auto ">
              ({members?.length})
            </span>
          </div>
        </div>
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Найти пользователя..."
            className="bg-transparent border-border border-2 rounded-md ml-7 pl-2  outline-none py-2 my-3 focus-visible:border-accent"
          />
        </div>
        <div className="flex flex-col gap-2 mx-3">
          {members?.map((i: any) => (
            <div className="flex gap-3 py-2 px-4 hover:bg-gray hover:bg-opacity-15 rounded-md cursor-pointer">
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
                    {chat.type === 'channel' ? (
                      !(
                        (i as IChannelMember).channelRole.isSystemRole &&
                        (i as IChannelMember).channelRole.name === 'Подписчик'
                      ) ? (
                        <div
                          className=""
                          style={{
                            color: (i as IChannelMember).channelRole.color
                          }}
                        >
                          {(i as IChannelMember).channelRole.name}
                        </div>
                      ) : null
                    ) : !(
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
                  Вступил {timeCalc(new Date((i as any).createdAt), true)}
                </div>
              </div>
              <div className="ml-auto mt-auto flex gap-2 my-auto">
                <MdModeEditOutline
                  className="size-5 text-gray my-auto opacity-65 hover:opacity-100 cursor-pointer "
                  onClick={() => {
                    setIsEdit({ isOpen: true, id: i.user.id });
                  }}
                />
                <MdDeleteOutline
                  className="size-5 text-red-700 my-auto opacity-65 hover:opacity-100 cursor-pointer"
                  onClick={() =>
                    setIsDeleteOpen({
                      name: i.user.name,
                      id: i.user.id,
                      isOpen: true
                    })
                  }
                />{' '}
              </div>
            </div>
          ))}
          {members.length === 0 ? (
            <div className="text-gray ml-2">
              Пользователей с таким именем нет.
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);

export default MembersModule;
