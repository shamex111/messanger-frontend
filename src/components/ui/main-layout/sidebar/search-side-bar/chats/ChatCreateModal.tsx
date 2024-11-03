'use client';

import { useCreateChatMutation } from '../searchSideBarItem/useCreateChatMutation';
import { LoadingOutlined } from '@ant-design/icons';
import { Upload, UploadProps } from 'antd';
import Cropper from 'cropperjs';
import Image from 'next/image';
import { FC, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { FiUsers } from 'react-icons/fi';
import { GoX } from 'react-icons/go';
import { MdPublic } from 'react-icons/md';
import { RiChatPrivateLine, RiUserVoiceLine } from 'react-icons/ri';
import { TbCameraPlus } from 'react-icons/tb';

import styles from '@/components/ui/main-layout/sideinfobar/SideInfoBar.module.scss';

import { SERVER_URL_BASE } from '@/config/api.config';

import fileService from '@/services/file.service';

import { IChannelForm } from '@/types/channel.types';

import ChatsCreateFields from './ChatsCreateFilds';

interface IChatCreateModal {
  setIsOpen: any;
}

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

const ChatCreateModal: FC<IChatCreateModal> = ({ setIsOpen }) => {
  const [type, setType] = useState<null | 'group' | 'channel'>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [cropper, setCropper] = useState<Cropper | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isUpload, setIsUpload] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { mutate } = useCreateChatMutation();

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
      console.log('Image loaded, initializing cropper');
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
        backgroundImage: `${isUpload ? `url(${SERVER_URL_BASE}${imageUrl})` : `url(${SERVER_URL_BASE}${'/uploads/default/avatarDefault.jpg'}`}`,
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

  const onSubmit: SubmitHandler<IChannelForm> = data => {
    const req = { ...data, private: isPrivate, avatar: imageUrl };
    mutate(
      { data: req, type: type as 'group' | 'channel' },
      {
        onSuccess: () => {
          toast(`${type === 'group' ? 'Группа создана' : 'Канал создан'}`, {
            icon: 'ⓘ'
          });
          setIsOpen(false);
        }
      }
    );
  };

  return (
    <div className="xl:w-[25vw] lg:w-[30vw] mt-[10%] overflow-y-auto rounded-xl bg-main shadow-black drop-shadow-lg px-2 xl:max-h-[600px] lg:max-h-[490px] flex flex-col gap-3 ">
      {type ? (
        <div>
          <div className="flex gap-4 ml-5 mt-4 mb-3">
            <FaArrowLeftLong
              className="size-6 my-auto text-gray cursor-pointer"
              onClick={() => setType(null)}
            />
            <div className=" text-xl font-semibold ">
              Создать {type === 'channel' ? 'канал' : 'группу'}
            </div>
          </div>
          <div className="mx-auto w-fit h-fit flex flex-col mt-3 xl:mb-5 ">
            <Upload
              name="avatar"
              listType="picture"
              className="avatar-uploader"
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
            <ChatsCreateFields errors={errors} register={register} />

            <div>
              <div className="flex justify-between max-w-[80%] mt-5 xl:mt-9 mx-auto ">
                <div className="flex gap-2">
                  {isPrivate ? (
                    <RiChatPrivateLine className="my-auto size-5" />
                  ) : (
                    <MdPublic className="my-auto size-5" />
                  )}
                  <div className="font-semibold">
                    {isPrivate
                      ? type === 'channel'
                        ? 'Приватный'
                        : 'Приватная'
                      : type === 'channel'
                        ? 'Публичный'
                        : 'Публичная'}
                  </div>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onClick={() => setIsPrivate(!isPrivate)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
              <div className="text-gray text-xs max-w-[80%] mt-3 mx-auto border-l-[3px] border-gray rounded-[4px] py-1 pl-2 bg-gray bg-opacity-10">
                {isPrivate
                  ? `Если ваш${
                      type === 'channel'
                        ? ' канал приватный, то пользователи не смогут найти его в поиске и вступить без одобрения.'
                        : 'а группа приватная, то пользователи не смогут найти ее в поиске и вступить без одобрения.'
                    }`
                  : `Если ваш${
                      type === 'channel'
                        ? ' канал публичный, то пользователи смогут найти его в поиске и вступить.'
                        : 'а группа публичная, то пользователи смогут найти ее в поиске и вступить.'
                    }`}
              </div>
            </div>
            <button
              type="submit"
              className="lg:w-[50px] xl:w-[60px] xl:h-[60px] bg-accent lg:h-[50px] rounded-full flex ml-auto mr-4  xl:my-5 lg:my-3 hover:bg-opacity-85 xl:mt-6 p-auto hover:pl-6 active:pl-8 duration-150"
            >
              <FaArrowRightLong className=" lg:size-4 xl:size-5 m-auto text-white ml-5" />
            </button>
          </form>
        </div>
      ) : (
        <div>
          <div className="flex justify-between mt-2 pb-2 px-2 border-b-2 xl:h-[50px] border-border">
            <div className="font-semibold my-auto">
              Выберите, что хотите создать
            </div>
            <GoX
              className="size-7 text-gray cursor-pointer my-auto"
              onClick={() => setIsOpen(false)}
            />
          </div>
          <div className="flex flex-col gap-2 py-3">
            <div
              className="flex justify-between px-3 rounded-md py-2 cursor-pointer hover:bg-gray hover:bg-opacity-20 xl:h-[50px]"
              onClick={() => setType('channel')}
            >
              <div className="flex gap-4 w-[80%] hover:w-[120%] active:w-[150%] duration-200">
                <RiUserVoiceLine className=" my-auto size-5" />
                <div className="my-auto font-medium">Создать канал</div>
              </div>
              <FaArrowRightLong className="size-5 my-auto text-gray " />
            </div>
            <div
              className="flex justify-between px-3 rounded-md py-2 cursor-pointer hover:bg-gray hover:bg-opacity-20 xl:h-[50px]"
              onClick={() => setType('group')}
            >
              <div className="flex gap-4 w-[80%] hover:w-[120%] active:w-[150%] duration-200">
                <FiUsers className=" my-auto size-5" />
                <div className="my-auto font-medium">Создать группу</div>
              </div>
              <FaArrowRightLong className="size-5 my-auto text-gray " />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatCreateModal;
