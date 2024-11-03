import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import channelService from '@/services/channel.service';
import groupService from '@/services/group.service';

export const useDeleteChatMutation = () => {
  const { mutate } = useMutation({
    mutationKey: ['delete chat'],
    mutationFn: async (data: { smthId: number; type: 'group' | 'channel' }) => {
      if (data.type === 'channel') {
        return await channelService.deleteChannel(data.smthId);
      } else {
        return await groupService.deleteGroup(data.smthId);
      }
    },
    onSuccess: () => {
      toast('Канал удален', {
        icon: 'ⓘ'
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
