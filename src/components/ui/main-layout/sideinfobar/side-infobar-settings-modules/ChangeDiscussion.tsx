import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import channelService from '@/services/channel.service';

export const useChangeDiscussion = () => {
  const { mutate } = useMutation({
    mutationKey: ['change discussion'],
    mutationFn: async (data: { channelId: number; action: 'create' | 'delete' }) => {
      if (data.action === 'create') {
        return await channelService.createDiscussion({ channelId: data.channelId });
      } else {
        return await channelService.deleteDiscussion(data.channelId);
      }
    },
    onError(error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Ошибка');
      }
    },
    onSuccess() {;
    }
  });

  return { mutate };
};
