'use client';

import { ConfigProvider, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { SlArrowDown } from 'react-icons/sl';

import { useStores } from '@/components/ui/chatStoreProvider';

import { IChannel, IChannelMember } from '@/types/channel.types';
import { IChat } from '@/types/chat.types';
import { IGroup } from '@/types/group.types';
import {
  IMessageBase,
  IMessageChannel,
  IMessageChat,
  IMessageGroup
} from '@/types/message.types';

import { TSmthType } from '@/socketService';
import chatStore from '@/stores/chatStore';

import styles from './Chat.module.scss';
import ChatMessage from './chat-messages/ChatMessage';
import { useChatMutation } from './useChatMutation';
import { useMessageQuery } from './useMessagesQuery';

interface IIChat {
  data: IChat | IChannel | IGroup;
  isPreview?: boolean;
  isInfoBarOpen?: boolean;
}

const Chat: FC<IIChat> = observer(({ data, isPreview, isInfoBarOpen }) => {
  const [isAtTop, setIsAtTop] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState<number | null>(null);
  const observerRefs = useRef<Map<number, IntersectionObserver>>(new Map());
  const { mutate } = useChatMutation();
  const { userStore } = useStores();
  const userId = userStore.user?.id;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const {
    isLoading,
    data: messageData,
    error
  } = useMessageQuery({
    count: isAtTop && !isPreview ? 30 : null,
    smthId: isAtTop && !isPreview ? (data.id as number) : null,
    type: isAtTop && !isPreview ? (data.type as TSmthType) : null,
    lastMessageId: isAtTop
      ? (data.messages as Array<any>)[(data.messages?.length as number) - 1]?.id
      : null
  });
  console.log('chat render');
  const markMessageAsRead = useCallback(
    (messageId: number, senderId: number) => {
      if (isPreview) return;
      if (userId !== senderId) mutate(messageId);
      const message = (
        data?.messages as IMessageGroup[] | IMessageChat[] | IMessageChannel[]
      ).find(i => i.id === messageId);
      if (data.type === 'channel') {
        if (
          message?.readChannels.find((i: any) => i.member.user.id === userId)
        ) {
          return;
        }
      } else if (data.type === 'group') {
        if (message?.readGroups.find((i: any) => i.member.user.id === userId)) {
          return;
        }
      } else if (data.type === 'chat') {
        if (message?.readUsers.find((i: any) => i.user.id === userId)) {
          return;
        }
      }
    },
    [userId, mutate]
  );

  const getScrollData = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;

      return isAtBottom;
    }
  }, []);

  const scrollFn = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollTop } = chatContainerRef.current;
      const px = data.count === 0 ? 0 : 0;

      const isAtTop = scrollTop <= px;
      setIsAtTop(isAtTop);
    }
  }, []);

  useEffect(() => {
    if (data.count === 0 || isPreview) {
      setTimeout(
        () => messagesEndRef.current?.scrollIntoView({ behavior: 'auto' }),
        10
      );
    }
  }, []);

  useEffect(() => {
    if (!isLoading && messageData) {
      const chatContainer = chatContainerRef.current;

      if (chatContainer) {
        setPrevScrollHeight(chatContainer.scrollHeight);
        console.log(chatContainer.scrollHeight)
      }

      chatStore.addMessages({
        type: data.type as TSmthType,
        smthId: data.id as number,
        newMessages: messageData.data
      });
    }

    if (error) toast.error(error.message);
  }, [isLoading, messageData, error]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    if (chatContainer && prevScrollHeight !== null && isAtTop) {
      setIsAtTop(false);
      const currentScrollHeight = chatContainer.scrollHeight;
      const scrollDiff = currentScrollHeight - prevScrollHeight;
      console.log(currentScrollHeight,prevScrollHeight,scrollDiff,chatContainer.scrollTop)
      chatContainer.scrollTop += scrollDiff;
    } else {
      const isAtBottom = getScrollData();
      if (isAtBottom) {
        scrollToBottom();
      }
    }
  }, [data?.messages, prevScrollHeight]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer && data?.messages) {
      data.messages.forEach((message: IMessageBase) => {
        const messageElement = document.getElementById(`message-${message.id}`);
        if (messageElement) {
          const observer = new IntersectionObserver(
            entries => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  markMessageAsRead(
                    message.id as number,
                    message.senderId as number
                  );
                  observer.disconnect();
                }
              });
            },
            { root: chatContainer, threshold: 0.0001 }
          );

          observer.observe(messageElement);
          observerRefs.current.set(message.id as number, observer);
        }
      });
    }

    return () => {
      observerRefs.current.forEach(observer => observer.disconnect());
    };
  }, [data?.messages]);

  const renderMessages = useMemo(() => {
    return (
      data?.messages &&
      [...data.messages].reverse().map((m: IMessageBase, ind: number) => {
        return (
          <ChatMessage
            message={m}
            key={m.id}
            smthId={data.id as number}
            id={m.id as number}
            type={data.type as TSmthType}
            beforeMessage={
              ind !== 0
                ? (data.messages as Array<any>)[
                    (data.messages as Array<any>).length - 1 - (ind - 1)
                  ]
                : null
            }
            afterMessage={
              ind !== (data.messages as Array<any>).length - 1
                ? (data.messages as Array<any>)[
                    (data.messages as Array<any>).length - 1 - (ind + 1)
                  ]
                : null
            }
          />
        );
      })
    );
  }, [data.messages]);

  return (
    <div className={styles.wrapper} ref={chatContainerRef} onScroll={scrollFn}>
      <div className="mx-auto w-[100%] flex  flex-col mt-2">
        {data.count ? (
          <div
            className={`absolute lg:mt-[55vh] duration-300 xl:mt-[72vh] cursor-pointer z-50 ml-[60%] ${isInfoBarOpen ? 'lg:ml-[39%] xl:ml-[48%]' : ''}`}
            onClick={() => scrollToBottom()}
          >
            <div className="w-8 h-[29px] rounded-full mx-auto mt-auto relative top-3 bg-accent flex">
              <div className="m-auto text-sm">{data.count}</div>
            </div>
            <button className="w-12 h-12 rounded-full mx-auto flex bg-secondary hover:bg-slate-700 duration-75 active:hover:bg-slate-800">
              <SlArrowDown className="size-[20px] m-auto mt-[17px]" />
            </button>
          </div>
        ) : null}
        {renderMessages?.length ? (
          renderMessages
        ) : (
          <div className="mx-auto  mb-2 px-2 py-1 bg-slate-700 bg-opacity-45 text-white font-medium text-sm rounded-md w-fit">
            Здесь пока-что пусто
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
});

export default Chat;
