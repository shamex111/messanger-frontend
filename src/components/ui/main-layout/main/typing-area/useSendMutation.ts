import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import messageService from '@/services/message.service';

import { IMessageForm } from '@/types/message.types';

export const useSendMutation = () => {
  const { mutate } = useMutation({
    mutationKey: ['send message'],
    mutationFn: (data: IMessageForm) =>
      messageService.createMessage({
        content: data.content,
        groupId: data.groupId,
        channelId: data.channelId,
        chatId: data.chatId,
        media:data.media || undefined
      }),
    onError(error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Ошибка');
      }
    }
  });
  return { mutate };
};
