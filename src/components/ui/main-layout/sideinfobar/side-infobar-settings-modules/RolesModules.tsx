'use client';

import Modal from '../../main/typing-area/Modal/Modal';
import { ColorPicker, Spin } from 'antd';
import { FC, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { IoMdAdd, IoMdClose, IoMdInformation } from 'react-icons/io';
import { MdDeleteOutline, MdModeEditOutline } from 'react-icons/md';

import { useStores } from '@/components/ui/chatStoreProvider';

import { IChannel, IChannelRole, IPermission } from '@/types/channel.types';
import { IGroup, IGroupRole } from '@/types/group.types';
import { permissionsVariant } from '@/types/permissions.enum';

import ModalRoleDelete from './ModalRoleDelete';
import styleForCheckBox from './checkbox.module.scss';
import { useCreateRoleMutation } from './useCreateRoleMutation';
import { useDeleteRoleMutation } from './useDeleteRoleMutation';
import { useEditRoleMutation } from './useEditRoleMutation';
import { usePermissionsQuery } from './useQueryPermissions';

interface IRolesModules {
  setModuleType: any;
  chat: IChannel | IGroup;
}

const RolesModules: FC<IRolesModules> = ({ chat, setModuleType }) => {
  const [isCreate, setIsCreate] = useState(false);
  const [color, setColor] = useState('ffffff');
  const [roleName, setRoleName] = useState('');
  const { isLoading, data, error } = usePermissionsQuery();
  const [permissions, setPermissions] = useState<permissionsVariant[]>([]);
  const [isEditRole, setIsEditRole] = useState<{
    isOpen: boolean;
    roleName: string;
  }>({ isOpen: false, roleName: '' });
  const [newDataForRole, setNewDataForRole] = useState<{
    color: string;
    name: string;
    permissions: permissionsVariant[];
  }>({ color: '#fff', name: '', permissions: [] });
  const [isDeleteOpen, setIsDeleteOpen] = useState<string>('');
  const { chatStore } = useStores();
  let roles: any = chat?.roles;
  const [searchTerm, setSearchTerm] = useState('');
  if (searchTerm) {
    roles = roles?.filter((i: any) =>
      i.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
  }
  const { mutate } = useCreateRoleMutation();
  const handleCreateRole = () => {
    if (roleName.trim()) {
      mutate(
        {
          smthId: chat.id as number,
          type: chat.type as 'channel' | 'group',
          data: {
            name: roleName,
            color: `#${color}`,
            permissionNames: Array.from(permissions)
          }
        },
        {
          onSuccess: () => {
            setModuleType('main');
          }
        }
      );
    }
  };
  const { mutate: deleteRoleMutate } = useDeleteRoleMutation();
  const handleRoledelete = (name: string) => {
    if (chat.type === 'channel') {
      deleteRoleMutate({
        data: { roleName: name, channelId: chat.id },
        type: 'channel'
      });
    } else {
      deleteRoleMutate({
        data: { roleName: name, groupId: chat.id },
        type: 'group'
      });
    }
  };
  const { mutate: editRoleMutate } = useEditRoleMutation();
  const handleEditRole = () => {
    if (chat.type === 'channel') {
      console.log(newDataForRole.color)
      editRoleMutate(
        {
          data: {
            newRoleName: newDataForRole.name,
            newPermissions: newDataForRole.permissions,
            color:  newDataForRole.color,
            channelId: chat.id,
            roleName: isEditRole.roleName
          },
          type: 'channel'
        },
        {
          onSuccess: () => {
            chatStore.editRole({
              type: chat.type as 'group' | 'channel',
              smthId: chat.id as number,
              name: newDataForRole.name,
              color:  newDataForRole.color,
              roleName: isEditRole.roleName,
              permissions: newDataForRole.permissions.map(i => ({
                permission: {
                  action: i
                }
              }))
            });
          }
        }
      );
    } else {
      editRoleMutate(
        {
          data: {
            newRoleName: newDataForRole.name,
            newPermissions: newDataForRole.permissions,
            color:  newDataForRole.color,
            groupId: chat.id,
            roleName: isEditRole.roleName
          },
          type: 'group'
        },
        {
          onSuccess: () => {
            chatStore.editRole({
              type: chat.type as 'group' | 'channel',
              smthId: chat.id as number,
              name: newDataForRole.name,
              color: newDataForRole.color,
              roleName: isEditRole.roleName,
              permissions: newDataForRole.permissions.map(i => ({
                permission: {
                  action: i
                }
              }))
            });
          }
        }
      );
    }
  };
  if (isEditRole.isOpen) {
    console.log(newDataForRole);
    return (
      <div>
        <div className="flex gap-10 ml-7 mt-4 mb-3">
          <FaArrowLeftLong
            className="size-6 my-auto text-gray cursor-pointer"
            onClick={() => {
              setIsEditRole({ isOpen: false, roleName: '' });
              setNewDataForRole({ color: '#fff', name: '', permissions: [] });
            }}
          />
          <div className="text-xl font-semibold">Редатирование роли</div>
        </div>
        <div>
          <div className="flex flex-col gap-2 mx-5 mt-7">
            <div>
              <div className={` flex gap-3`}>
                <input
                  className={`flex lg:h-[40px] h-[40px] w-[67%] bg-transparent border-[2px]  rounded-[10px] border-border px-1 py-2 text-sm focus-visible:outline-none`}
                  placeholder="Имя роли"
                  value={newDataForRole.name}
                  onChange={(e: any) =>
                    setNewDataForRole({
                      name: e.target.value,
                      color: newDataForRole.color,
                      permissions: newDataForRole.permissions
                    })
                  }
                  maxLength={24}
                />
                <ColorPicker
                  value={newDataForRole.color}
                  onChange={newColor =>
                    setNewDataForRole({
                      name: newDataForRole.name,
                      color: '#' + newColor.toHex(),
                      permissions: newDataForRole.permissions
                    })
                  }
                  allowClear
                  className="w-fit h-fit text-white my-auto"
                  style={{ backgroundColor: '#111828', border: 'none' }}
                />
                <div className="my-auto text-sm text-gray">Цвет роли</div>
              </div>
            </div>
            <div className="mt-2">
              <div className="font-semibold ">Права роли</div>

              <div>
                {isLoading ? (
                  <Spin />
                ) : error ? (
                  <div className="text-red-500">
                    Ошибка загрузки пермиссионс error:{error.message}
                  </div>
                ) : (
                  data?.map((i: IPermission) => (
                    <div
                      key={i.id}
                      className="flex gap-4 w-[90%] max-w-[90%] mx-auto justify-between my-4"
                    >
                      <div>
                        <div
                          className={`${i.action === 'delete' || i.action === 'removeMember' || i.action === 'changeRole' ? 'text-red-700' : ''} ${i.action === 'edit' || i.action === 'changeDiscussion' ? 'text-accent' : ''} `}
                        >
                          {i.description}
                        </div>
                      </div>
                      <div>
                        <label className={styleForCheckBox.switch}>
                          <input
                            type="checkbox"
                            checked={
                              newDataForRole.permissions.find(
                                o => o === i.action
                              )
                                ? true
                                : false
                            }
                            onChange={e => {
                              e.target.checked
                                ? setNewDataForRole({
                                    permissions: [
                                      ...(newDataForRole.permissions as any),
                                      i.action
                                    ],
                                    color: newDataForRole.color,
                                    name: newDataForRole.name
                                  })
                                : setNewDataForRole({
                                    permissions:
                                      newDataForRole.permissions.filter(
                                        o => o !== i.action
                                      ),
                                    color: newDataForRole.color,
                                    name: newDataForRole.name
                                  });
                            }}
                          />
                          <span className={styleForCheckBox.slider}></span>
                        </label>
                      </div>
                    </div>
                  ))
                )}
                <div className="flex gap-3 mx-auto">
                  <div className=" h-fit rounded-md font-medium bg-white bg-opacity-15 p-2 w-fit text-xs">
                    Базовые права
                  </div>
                  <div
                    className=" h-fit rounded-md font-medium text-accent bg-accent bg-opacity-15 p-2 w-fit text-xs"
                    w-fit
                  >
                    Повышенные права
                  </div>
                  <div className=" h-fit rounded-md font-medium  text-red-700 bg-red-700 bg-opacity-15 p-2 w-fit text-xs">
                    Высшие права
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="absolute top-[85vh] left-[100vw] lg:right-[230px] xl:right-[250px] z-20 lg:w-[50px] xl:w-[60px] xl:h-[60px] bg-accent lg:h-[50px] rounded-full flex ml-auto mr-4  xl:my-5 lg:my-3 hover:bg-opacity-85 xl:mt-6 p-auto hover:pl-6 active:pl-8 duration-150"
          onClick={() => {
            setIsEditRole({ isOpen: false, roleName: '' });
            setNewDataForRole({ color: '#fff', name: '', permissions: [] });
            handleEditRole();
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
        <Modal isOpen={isDeleteOpen}>
          <ModalRoleDelete
            setIsOpen={setIsDeleteOpen}
            name={isDeleteOpen}
            deleteRole={handleRoledelete}
          ></ModalRoleDelete>
        </Modal>
      ) : null}
      <div className="flex gap-10 ml-7 mt-4 mb-3">
        <FaArrowLeftLong
          className="size-6 my-auto text-gray cursor-pointer"
          onClick={() => setModuleType('main')}
        />
        <div className="text-xl font-semibold">
          Роли{' '}
          <span className="text-gray text-base my-auto ml-2">
            ({chat?.roles?.length})
          </span>
        </div>
      </div>
      {isCreate ? (
        <>
          <div className="flex flex-col gap-2 mx-5 mt-7">
            <div className="flex justify-between mb-3">
              <div className="text-gray text-base font-medium">
                Создание новой роли
              </div>
              <IoMdClose
                className="text-gray cursor-pointer my-auto size-6 ml-auto mr-2"
                onClick={() => setIsCreate(false)}
              />
            </div>
            <div>
              <div className={` flex gap-3`}>
                <input
                  className={`flex lg:h-[40px] h-[40px] w-[67%] bg-transparent border-[2px]  rounded-[10px] border-border px-1 py-2 text-sm focus-visible:outline-none`}
                  placeholder="Имя роли"
                  value={roleName}
                  onChange={e => setRoleName(e.target.value)}
                  maxLength={24}
                />
                <ColorPicker
                  value={color}
                  onChange={newColor => setColor(newColor.toHex())}
                  allowClear
                  className="w-fit h-fit text-white my-auto"
                  style={{ backgroundColor: '#111828', border: 'none' }}
                />
                <div className="my-auto text-sm text-gray">Цвет роли</div>
              </div>
            </div>
            <div className="mt-2">
              <div className="font-semibold ">Права роли</div>

              <div>
                {isLoading ? (
                  <Spin />
                ) : error ? (
                  <div className="text-red-500">
                    Ошибка загрузки пермиссионс error:{error.message}
                  </div>
                ) : (
                  data?.map((i: IPermission) => (
                    <div
                      key={i.id}
                      className="flex gap-4 w-[90%] max-w-[90%] mx-auto justify-between my-4"
                    >
                      <div>
                        <div
                          className={`${i.action === 'delete' || i.action === 'removeMember' || i.action === 'changeRole' ? 'text-red-700' : ''} ${i.action === 'edit' || i.action === 'changeDiscussion' ? 'text-accent' : ''} `}
                        >
                          {i.description}
                        </div>
                      </div>
                      <div>
                        <label className={styleForCheckBox.switch}>
                          <input
                            type="checkbox"
                            checked={
                              permissions.find(o => o === i.action)
                                ? true
                                : false
                            }
                            onChange={e => {
                              e.target.checked
                                ? setPermissions([
                                    ...(permissions as any),
                                    i.action
                                  ])
                                : setPermissions(
                                    permissions.filter(o => o !== i.action)
                                  );
                            }}
                          />
                          <span className={styleForCheckBox.slider}></span>
                        </label>
                      </div>
                    </div>
                  ))
                )}
                <div className="flex gap-3 mx-auto">
                  <div className=" h-fit rounded-md font-medium bg-white bg-opacity-15 p-2 w-fit text-xs">
                    Базовые права
                  </div>
                  <div
                    className=" h-fit rounded-md font-medium text-accent bg-accent bg-opacity-15 p-2 w-fit text-xs"
                    w-fit
                  >
                    Повышенные права
                  </div>
                  <div className=" h-fit rounded-md font-medium  text-red-700 bg-red-700 bg-opacity-15 p-2 w-fit text-xs">
                    Высшие права
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full bg-secondary h-3 my-4"></div>
          <div className="flex gap-2 mx-2">
            <AiOutlineInfoCircle className="size-5 my-auto" />
            <div className="text-gray w-[90%] mx-auto text-[15px] ">
              Не давайте повышенные и высшие права лицам, которым не доверяется,
              это может привести к потере вашего контроля над{' '}
              {chat.type === 'channel' ? 'каналом!' : 'группой!'}
            </div>
          </div>
          {roleName ? (
            <button
              type="submit"
              className="absolute top-[85vh] left-[100vw] lg:right-[230px] xl:right-[250px] z-20 lg:w-[50px] xl:w-[60px] xl:h-[60px] bg-accent lg:h-[50px] rounded-full flex ml-auto mr-4  xl:my-5 lg:my-3 hover:bg-opacity-85 xl:mt-6 p-auto hover:pl-6 active:pl-8 duration-150"
              onClick={() => handleCreateRole()}
            >
              <FaArrowRightLong className=" lg:size-4 xl:size-5 m-auto text-white ml-5" />
            </button>
          ) : null}
        </>
      ) : (
        <div className="flex flex-col gap-2 mx-5 mt-7">
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Найти роль..."
              className="bg-transparent border-border border-2 rounded-md ml-7 pl-2 outline-none py-2 my-3 focus-visible:border-accent"
            />
          </div>
          <div className="flex justify-between mb-3">
            <div className={`text-gray text-base font-medium`}>
              Роли {chat.type === 'channel' ? 'канала' : 'группы'}
            </div>
            <IoMdAdd
              className="text-gray cursor-pointer my-auto size-6 ml-auto mr-2"
              onClick={() => setIsCreate(true)}
            />
          </div>

          {roles?.map((i: IChannelRole | IGroupRole) => (
            <div
              key={i.id}
              className="flex px-3 py-[10px] cursor-pointer hover:bg-secondary rounded-lg gap-3"
            >
              <div
                className="w-[6px] h-[6px] rounded-full my-auto"
                style={{ backgroundColor: i.color }}
              ></div>
              <div style={{ color: i.color }}>{i.name}</div>
              <div className="flex gap-2 ml-auto mr-4">
                {i.isSystemRole ? null : (
                  <>
                    <MdModeEditOutline
                      className="size-5 text-gray my-auto opacity-65 hover:opacity-100 cursor-pointer "
                      onClick={() => {
                        setNewDataForRole({
                          color: i.color as string,
                          name: i.name,
                          permissions: [
                            ...i.permissions.map(i => i.permission.action)
                          ]
                        });
                        setIsEditRole({ isOpen: true, roleName: i.name });
                      }}
                    />
                    <MdDeleteOutline
                      className="size-5 text-red-700 my-auto opacity-65 hover:opacity-100 cursor-pointer"
                      onClick={() => setIsDeleteOpen(i.name)}
                    />{' '}
                  </>
                )}
              </div>
            </div>
          ))}
          {roles.length === 0 ? (
            <div className="text-gray ml-2">
              Ролей с таким именем несуществует.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default RolesModules;
