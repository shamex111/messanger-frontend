import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import channelService from '@/services/channel.service';

export const useNotificationMutation = () => {
  const { mutate } = useMutation({
    mutationKey: ['change notification'],
    mutationFn: (payload: { isMuted: boolean; chatId: number }) => {
      return channelService.changeNotifications({
        isMuted: !payload.isMuted,
        channelId: payload.chatId
      });
    },
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
