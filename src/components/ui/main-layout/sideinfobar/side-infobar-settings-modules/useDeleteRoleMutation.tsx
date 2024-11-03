import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import channelService from '@/services/channel.service';
import groupService from '@/services/group.service';

import { IChannelEdit } from '@/types/channel.types';
import { IDeleteRole } from '@/types/group.types';

export const useDeleteRoleMutation = () => {
  const { mutate } = useMutation({
    mutationKey: ['delete role'],
    mutationFn: async (data: {
      data: any;
      type: 'group' | 'channel';
    }) => {
      if (data.type === 'channel') {
        return await channelService.deleteRole(data.data as any);
      } else {
        return await groupService.deleteRole(data.data);
      }
    },
    onError(error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Ошибка');
      }
    },
    onSuccess:() => {
      toast('Роль удалена',{
        icon: 'ⓘ'
      })
    }
  });
  return { mutate };
};
