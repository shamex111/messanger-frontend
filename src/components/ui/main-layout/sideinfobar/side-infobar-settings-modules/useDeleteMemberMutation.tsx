import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import channelService from '@/services/channel.service';
import groupService from '@/services/group.service';

export const useDeleteMemberMutation = () => {
  const { mutate } = useMutation({
    mutationKey: ['delete member'],
    mutationFn: async (data: { data: any; type: 'group' | 'channel' }) => {
      if (data.type === 'channel') {
        return await channelService.deleteMember(data.data as any);
      } else {
        return await groupService.deleteMember(data.data);
      }
    },
    onError(error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Ошибка');
      }
    },
    onSuccess: () => {
      toast('Пользователь удален!', {
        icon: 'ⓘ'
      });
    }
  });
  return { mutate };
};
