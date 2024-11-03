import { LoadingOutlined } from '@ant-design/icons';
import { Upload, UploadProps } from 'antd';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { TbCameraPlus } from 'react-icons/tb';

import {  SERVER_URL_BASE } from '@/config/api.config';

import fileService from '@/services/file.service';
import userService from '@/services/user.service';

import { IUser } from '@/types/user.types';



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

interface IChangeAvatar {
  user: IUser;
  setIsEdit:any
}

const ChangeAvatar: React.FC<IChangeAvatar> = ({ user,setIsEdit}) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [cropper, setCropper] = useState<Cropper | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const uploadImage = async (file: File) => {
    try {
      const res = await fileService.uploadAvatar(file);
      if (res.data.path) {
        await userService.editUser({ avatar: res.data.path });
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
      return;
    }
    if (info.file.status === 'done' && !imageUrl) {
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
        width: 370,
        height: 370
      });
      canvas.toBlob(async blob => {
        if (blob) {
          const file = new File([blob], 'avatar.png', { type: 'image/png' });
          const response = await uploadImage(file);
          setImageUrl(response);
        }
      }, 'image/png');
      setImageUrl(undefined)

      toast.success('Аватарка изменена!');
      setIsEdit(false)
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
        backgroundImage: `url(${SERVER_URL_BASE}${user.avatar})`,
        borderRadius: '50%',
        height: 120,
        width: 120,
        display: 'flex',
        justifyContent: 'center'
      }}
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

  return (
    <div className="mx-auto w-fit h-fit flex flex-col ">
      <Upload
        name="avatar"
        listType="picture"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <div>
            <img
              ref={imageRef}
              src={imageUrl}
              alt="avatar"
              style={{ width: 220, height: 220 }}
              onLoad={handleImageLoad}
            />
          </div>
        ) : (
          uploadButton
        )}
      </Upload>
      {imageUrl && (
        <button onClick={handleCropAndUpload} className='border border-accent rounded-xl mt-[20px] p-1 text-sm hover:bg-accent hover:shadow-md hover:shadow-accent hover:bg-opacity-70 duration-200'>Обрезать и загрузить</button>
      )}
    </div>
  );
};

export default ChangeAvatar;
