import { useEdit } from '../chat/EditProvider';
import { useEditMutation } from '../chat/chat-messages/useEditMutation';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { GoX } from 'react-icons/go';
import { HiOutlinePaperClip } from 'react-icons/hi';
import { IoMdSend } from 'react-icons/io';
import { MdOutlineEdit } from 'react-icons/md';

import { useStores } from '@/components/ui/chatStoreProvider';

import fileService from '@/services/file.service';

import { IFile, IFileForShort } from '@/types/file.types';
import { IMessageForm } from '@/types/message.types';
import { permissionsVariant } from '@/types/permissions.enum';

import { TSmthType } from '@/socketService';

import MediaModal from './Modal/MediaModal/MediaModal';
import Modal from './Modal/Modal';
import styles from './TypingArea.module.scss';
import { useSendMutation } from './useSendMutation';

interface ITypingArea {
  smthId: number;
  type: TSmthType;
}

const TypingArea: FC<ITypingArea> = ({ smthId, type }) => {
  const [value, setValue] = useState<string>('');
  const { chatStore, userStore } = useStores();
  const [isModalOpenAndData, setIsModalOpenAndData] = useState<
    Array<IFileForShort>
  >([]);
  const { mutate: messageMutation } = useSendMutation();
  const { mutate: messageEditMutation } = useEditMutation();
  const { isEditMessageId, setIsEdit } = useEdit();
  const handleSend = (valueAt?: string, withMedia?: boolean) => {
    // if (valueAt && !valueAt.trim()) return;

    if (valueAt === undefined && !value.trim()) return;

    let data: IMessageForm = { content: valueAt || value };
    if (data.content.length > 10000)
      data.content = data.content.slice(0, 10000);
    if (type === 'channel') data.channelId = smthId;
    else if (type === 'group') data.groupId = smthId;
    else if (type === 'chat') data.chatId = smthId;
    if (isEditMessageId) {
      messageEditMutation({ id: isEditMessageId, content: value });
      setIsEdit(null);
      setValue('');
      return;
    }
    data.media = isModalOpenAndData;
    isModalOpenAndData.forEach(i => chatStore.updateChatMedia({smthId,type,media:i}))
    
    setValue('');
    messageMutation(data, {
      onSuccess: res => {
        setIsModalOpenAndData([]);
      }
    });
  };

  useEffect(() => {
    setValue(
      chatStore.allChats
        .find(i => i.type === type && i.id === smthId)
        ?.messages.find((i: any) => i.id === isEditMessageId)?.content
    );
  }, [isEditMessageId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const attachment = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files;

    if (files?.length && files?.length > 20) {
      toast.error('Вы превысили лимит в 20 медиа-файлов!');
      return;
    }

    if (files && files.length > 0) {
      let data: IFileForShort[] = [];

      await Promise.all(
        Array.from(files).map(async file => {
          if (file.type.startsWith('image/')) {
            try {
              const fileData = await fileService.uploadImage(file);
              data.push({ url: fileData.data.path, type: fileData.data.type });
            } catch (e: any) {
              toast.error(e?.message || 'Ошибка загрузки изображения');
            }
          } else if (file.type.startsWith('video/')) {
            try {
              const fileData = await fileService.uploadVideo(file);
              data.push({ url: fileData.data.path, type: fileData.data.type });
            } catch (e: any) {
              toast.error(e?.message || 'Ошибка загрузки видео');
            }
          } else {
            console.log('Неподдерживаемый тип файла:', file.name);
          }
        })
      );

      console.log(data);

      if (data.length !== 0) {
        setIsModalOpenAndData(prev => [...prev, ...data]);
      }
    }
    setValue('');
  };

  return (
    <div className={`${styles.wrapper}`}>
      {isModalOpenAndData.length ? (
        <Modal isOpen={isModalOpenAndData}>
          <MediaModal
            media={isModalOpenAndData}
            value={value}
            clearValue={setValue}
            setIsOpen={setIsModalOpenAndData}
            handleSend={handleSend}
          />
        </Modal>
      ) : null}
      <div
        className={`${styles.typingArea}  ${isEditMessageId ? 'h-[105px]' : 'h-[56px]'}`}
      >
        {isEditMessageId ? (
          <div className="h-[30px] w-full  flex pl-3 gap-3 pt-2 ">
            <MdOutlineEdit className="size-6 text-accent my-auto" />
            <div className="flex flex-col bg-accent bg-opacity-15 rounded-[4px] py-1 pl-2 border-l-[3px] w-[85%] border-accent">
              <div className="color-accent font-medium text-sm text-accent">
                Редактировать сообщение
              </div>
              <div className="text-sm  lg:max-w-[400px] xl:max-w-[680px] lg:w-[400px] xl:w-[680px] overflow-x-hidden">
                {
                  chatStore.allChats
                    .find(i => i.type === type && i.id === smthId)
                    ?.messages.find((i: any) => i.id === isEditMessageId)
                    ?.content
                  // .substr(0, 45)
                }
              </div>
            </div>
            <GoX
              className="my-auto size-7 text-accent cursor-pointer ml-auto mr-5"
              onClick={() => {
                setIsEdit(null);
                setValue('');
              }}
            />
          </div>
        ) : null}
        <div className="flex h-[56px] justify-between pr-5">
          <input
            type="text"
            className={styles.input}
            placeholder="Сообщение"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={10000}
          />
          <div className="h-fit my-auto">
            {(
              type === 'channel'
                ? userStore.user?.channelMembers
                    ?.find(i => i.channelId === smthId)
                    ?.channelRole.permissions.find(
                      i => i.permission.action === permissionsVariant.addMedia
                    )
                : type === 'group'
                  ? userStore.user?.groupMembers
                      ?.find(i => i.groupId === smthId)
                      ?.groupRole.permissions.find(
                        i => i.permission.action === permissionsVariant.addMedia
                      )
                  : type === 'chat'
                    ? true
                    : null
            ) ? (
              <div>
                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.ifg,.webp,.mp4,.avi,.mkv,.mov"
                  id="file"
                  className=" opacity-0 w-[0.1px] h-[0.1px] absolute"
                  onChange={attachment}
                  onClick={() => {
                    setIsEdit(null);
                    // setValue('');
                  }}
                />
                <label htmlFor="file">
                  <HiOutlinePaperClip className="hover:text-accent duration-100 my-auto text-2xl ml-auto w-fit text-gray cursor-pointer" />
                </label>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className={styles.send} onClick={() => handleSend()}>
        <IoMdSend className="m-auto ml-4 text-[28px]" />
      </div>
    </div>
  );
};

export default TypingArea;
