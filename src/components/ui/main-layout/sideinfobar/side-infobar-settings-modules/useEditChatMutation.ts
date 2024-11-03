import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import channelService from '@/services/channel.service';
import groupService from '@/services/group.service';

import { IChannelEdit } from '@/types/channel.types';
import { IGroupEdit } from '@/types/group.types';

export const useEditChatMutation = () => {
  const { mutate } = useMutation({
    mutationKey: ['edit chat'],
    mutationFn: async (data: {
      data: any;
      type: 'group' | 'channel';
    }) => {
      if (data.type === 'channel') {
        return await channelService.editChannel(data.data as IChannelEdit);
      } else {
        return await groupService.editGroup(data.data as IGroupEdit);
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
      toast.success('Изменения успешно применены!');
    },
  });
  return { mutate };
};
