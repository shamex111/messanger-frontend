'use client';

import Image from 'next/image';
import { FC, useEffect, useRef } from 'react';

import { SERVER_URL_BASE } from '@/config/api.config';

interface IImageModal {
  type: 'video' | 'image';
  setClose: any;
  isOpen: { type: '' | 'video' | 'image'; url: string };
}

const ImageModal: FC<IImageModal> = ({ type, setClose, isOpen }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setClose();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClose);
    return () => {
      document.removeEventListener('click', handleClose);
    };
  }, []);

  return (
    <div
      ref={modalRef}
      className="w-fit m-auto max-h-[70vh] object-cover max-w-[50wv] rounded-xl bg-main shadow-black drop-shadow-lg px-2 xl:max-h-[600px] lg:max-h-[450px] flex flex-col gap-3"
    >
      {type === 'image' ? (
        <Image
          src={SERVER_URL_BASE + isOpen.url}
          alt="Изображение"
          width={500}
          height={500}
          className="xl:min-w-[700px] max-h-[70vh]  max-w-[50wv]  lg:min-w-[350px] min-w-[250px]"
        />
      ) : (
        <video
          className="max-h-[70vh] xl:min-w-[600px] object-cover max-w-[50wv] lg:min-w-[350px] min-w-[250px]"
          src={SERVER_URL_BASE + isOpen.url}
          controls
        />
      )}
    </div>
  );
};

export default ImageModal;
