'use client';

import Modal from '../../main/typing-area/Modal/Modal';
import ChatsCreateFields from '../../sidebar/search-side-bar/chats/ChatsCreateFilds';
import { LoadingOutlined } from '@ant-design/icons';
import { Upload, UploadProps } from 'antd';
import Cropper from 'cropperjs';
import { FC, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BiLockAlt } from 'react-icons/bi';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { FiMessageSquare } from 'react-icons/fi';
import { LuUsers } from 'react-icons/lu';
import { MdDeleteOutline } from 'react-icons/md';
import { RiUserSettingsLine } from 'react-icons/ri';
import { TbCameraPlus } from 'react-icons/tb';

import { useStores } from '@/components/ui/chatStoreProvider';

import { SERVER_URL_BASE } from '@/config/api.config';

import fileService from '@/services/file.service';

import {
  IChannel,
  IChannelForm,
  IChannelMember,
  IPermission
} from '@/types/channel.types';
import { IGroup, IGroupMember } from '@/types/group.types';

import ModalDelete from './ModaldeleteChat';
import { useDeleteChatMutation } from './useDeleteChatMutation';
import { useEditChatMutation } from './useEditChatMutation';

const getBase64 = (img: any, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: any) => {
  const isJpgOrPng =
    file.type === 'image/jpeg' ||
    file.type === 'image/webp' ||
    file.type === 'image/jpg';
  if (!isJpgOrPng) {
    toast.error('You can only upload jpg|jpeg|webp file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    toast.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};
interface ISideInfoBarSettings {
  setIsOpen: any;
  description: string;
  name: string;
  type: 'group' | 'channel';
  isPrivate: boolean;
  id: number;
  defaultAvatar: string;
  setModuleType: any;
  chat: any;
}

const SideInfoBarSettings: FC<ISideInfoBarSettings> = ({
  setIsOpen,
  description,
  name,
  type,
  isPrivate,
  id,
  defaultAvatar,
  setModuleType,
  chat
}) => {
  const [loading, setLoading] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [cropper, setCropper] = useState<Cropper | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageUrl, setImageUrl] = useState<string>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const uploadImage = async (file: File) => {
    try {
      const res = await fileService.uploadAvatar(file);
      if (res.data.path) {
        console.log(res.data.path);
        return res.data.path;
      }
    } catch (error) {
      toast.error('Ошибка загрузки изображения');
      console.error('Upload error:', error);
    }
  };

  const handleChange: UploadProps['onChange'] = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      setIsUpload(false);
      return;
    }
    if (info.file.status === 'done') {
      if (cropper) {
        cropper.destroy();
        setCropper(null);
      }
      setImageUrl(undefined);
      getBase64(info.file.originFileObj as any, url => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const handleImageLoad = () => {
    if (imageRef.current) {
      const cropperInstance = new Cropper(imageRef.current, {
        aspectRatio: 1,
        viewMode: 1,
        cropBoxResizable: true,
        zoomable: true,
        scalable: false
      });
      setCropper(cropperInstance);
    }
  };

  const handleCropAndUpload = async () => {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas({
        width: 200,
        height: 200
      });
      canvas.toBlob(async blob => {
        if (blob) {
          const file = new File([blob], 'avatar.png', { type: 'image/png' });
          const response = await uploadImage(file);
          if (response) {
            setImageUrl(response);
            setIsUpload(true);
          }
        }
      }, 'image/png');
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
        backgroundImage: `${isUpload ? `url(${SERVER_URL_BASE}${imageUrl})` : `url(${SERVER_URL_BASE + defaultAvatar}`}`,
        borderRadius: '50%',
        height: 120,
        width: 120,
        display: 'flex',
        justifyContent: 'center'
      }}
      className="my-2"
      type="button"
    >
      {loading ? (
        <LoadingOutlined className="my-auto mx-auto" />
      ) : (
        <TbCameraPlus
          className="text-6xl my-auto hover:text-7xl duration-200"
          color="white"
        />
      )}
    </button>
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IChannelForm>({
    mode: 'onChange'
  });
  const { mutate } = useEditChatMutation();
  const { mutate: deleteMutation } = useDeleteChatMutation();
  const handleDelete = () => {
    deleteMutation({ smthId: chat.id, type: chat.type });
  };
  const onSubmit: SubmitHandler<IChannelForm> = data => {
    const req = {
      name: data.name,
      description: data.description,
      avatar: isUpload ? imageUrl : defaultAvatar
    };
    if (type === 'channel') {
      mutate({
        type: 'channel',
        data: {
          ...req,
          channelId: chat.id
        }
      });
    } else {
      mutate({
        type: 'group',
        data: {
          ...req,
          groupId: chat.id
        }
      });
    }
    setIsOpen(false);
  };
  const { userStore, chatStore } = useStores();
  let member;
  // if (chat.type === 'group')
  //   member = userStore.user?.groupMembers?.find(i => i.groupId === chat.id);
  // else if (chat.type === 'channel')
  //   member = userStore.user?.channelMembers?.find(i => i.channelId === chat.id);
  member = chatStore.allChats
    .find(i => i.type === chat.type && i.id === chat.id)
    ?.members?.find((i: any) => i.user.id === userStore.user?.id);

  return (
    <div className="h-full overflow-y-auto">
      {
        <Modal isOpen={isDeleteModalOpen}>
          <ModalDelete
            image={chat.avatar}
            name={chat.name}
            setIsOpen={setIsDeleteModalOpen}
            type={chat.type}
            deleteChat={handleDelete}
          />
        </Modal>
      }
      <div className="flex gap-10 ml-7 mt-4 mb-3">
        <FaArrowLeftLong
          className="size-6 my-auto text-gray cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
        <div className="text-xl font-semibold">Настройки</div>
      </div>
      {(
        chat.type === 'channel'
          ? (member as IChannelMember).channelRole.permissions.find(
              i => i.permission.action === 'edit'
            )
          : (member as IGroupMember).groupRole.permissions.find(
              i => i.permission.action === 'edit'
            )
      ) ? (
        <>
          <div className="mx-auto w-fit h-fit flex flex-col mt-7 xl:mb-5">
            <Upload
              name="avatar"
              listType="picture"
              className="avatar-uploader mb-2"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl && !isUpload ? (
                <div>
                  <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="avatar"
                    style={{ width: 100, height: 200 }}
                    onLoad={handleImageLoad}
                  />
                </div>
              ) : (
                uploadButton
              )}
            </Upload>
            {imageUrl && !isUpload && (
              <button
                onClick={handleCropAndUpload}
                className="border border-accent rounded-xl mt-[20px] p-1 text-sm hover:bg-accent mb-2 hover:bg-opacity-70 duration-200"
              >
                Обрезать
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ChatsCreateFields
              register={register}
              errors={errors}
              defaultValues={{ name, description }}
            />{' '}
            <button
              type="submit"
              className="absolute z-20 lg:w-[50px] xl:w-[60px] xl:h-[60px] bg-accent lg:h-[50px] rounded-full flex left-auto right-10 top-[85vh]  xl:my-5 lg:my-3 hover:bg-opacity-85  hover:pl-6 active:pl-8 duration-150"
            >
              <FaArrowRightLong className=" lg:size-4 xl:size-5 m-auto text-white ml-5" />
            </button>
          </form>
          <div
            className="flex gap-7 px-3 mt-2 py-[14px] cursor-pointer w-[95%] mx-auto hover:bg-secondary  rounded-lg "
            onClick={() => setModuleType('private')}
          >
            <BiLockAlt className="size-7 text-gray my-auto" />
            <div className="flex flex-col my-auto">
              <div>Тип {type === 'channel' ? 'канала' : 'группы'}</div>
              <div className="text-[13px] text-gray">
                {isPrivate ? 'Приватный' : 'Публчиный'}
              </div>
            </div>
          </div>
        </>
      ) : null}

      <div className="flex flex-col gap-4 mt-3">
        {type === 'channel' ? (
          (member as IChannelMember).channelRole.permissions.find(
            i => i.permission.action === 'changeDiscussion'
          ) ? (
            <div
              className="flex gap-7 px-3 py-[14px] cursor-pointer w-[95%] mx-auto hover:bg-secondary  rounded-lg "
              onClick={() => setModuleType('discussion')}
            >
              <FiMessageSquare className="size-7 text-gray my-auto" />
              <div className="flex flex-col my-auto">
                <div>Обсуждение</div>
                <div className="text-[13px] text-gray">
                  {chat.discussion ? 'Настроить' : 'Добавить'}
                </div>
              </div>
            </div>
          ) : null
        ) : null}
        <div className="w-full bg-secondary h-3"></div>
        {(
          chat.type === 'channel'
            ? (member as IChannelMember).channelRole.permissions.find(
                i => i.permission.action === 'changeRole'
              )
            : (member as IGroupMember).groupRole.permissions.find(
                i => i.permission.action === 'changeRole'
              )
        ) ? (
          <div
            className="flex gap-7 px-3 py-[14px] cursor-pointer w-[95%] mx-auto hover:bg-secondary  rounded-lg "
            onClick={() => setModuleType('roles')}
          >
            <RiUserSettingsLine className="size-7 text-gray my-auto" />

            <div className="flex flex-col my-auto">
              <div>Роли {type === 'channel' ? 'канала' : 'группы'}</div>
              <div className="text-[13px] text-gray">
                {(chat as IChannel | IGroup).roles?.length}
              </div>
            </div>
          </div>
        ) : null}
        {(
          chat.type === 'channel'
            ? (member as IChannelMember).channelRole.permissions.find(
                i =>
                  i.permission.action === 'removeMember' ||
                  i.permission.action === 'changeRole'
              )
            : (member as IGroupMember).groupRole.permissions.find(
                i =>
                  i.permission.action === 'removeMember' ||
                  i.permission.action === 'changeRole'
              )
        ) ? (
          <div
            className="flex gap-7 px-3 py-[14px] cursor-pointer w-[95%] mx-auto hover:bg-secondary  rounded-lg "
            onClick={() => setModuleType('members')}
          >
            <LuUsers className="size-7 text-gray my-auto" />
            <div className="flex flex-col my-auto">
              <div>
                {type === 'channel' ? 'Подписчики канала' : 'Участники группы'}
              </div>
              <div className="text-[13px] text-gray">
                {(chat as IChannel | IGroup).members?.length}
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {(
        chat.type === 'channel'
          ? (member as IChannelMember).channelRole.permissions.find(
              i => i.permission.action === 'delete'
            )
          : (member as IGroupMember).groupRole.permissions.find(
              i => i.permission.action === 'delete'
            )
      ) ? (
        <>
          <div className="w-full bg-secondary h-3 my-4"></div>
          <div
            className="flex gap-7 px-3 py-[14px] cursor-pointer w-[95%] mx-auto hover:bg-secondary  rounded-lg"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <MdDeleteOutline className="size-7 text-red-600" />
            <div className="text-[17px] text-red-600">
              Удалить {type === 'channel' ? 'канал' : 'группу'}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SideInfoBarSettings;
