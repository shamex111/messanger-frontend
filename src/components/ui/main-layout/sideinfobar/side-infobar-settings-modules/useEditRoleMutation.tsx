import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import channelService from '@/services/channel.service';
import groupService from '@/services/group.service';


export const useEditRoleMutation = () => {
  const { mutate } = useMutation({
    mutationKey: ['edit role'],
    mutationFn: async (data: {
      data: any;
      type: 'group' | 'channel';
    }) => {
      if (data.type === 'channel') {
        return await channelService.editRole(data.data as any);
      } else {
        return await groupService.editRole(data.data);
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
      toast.success('Роль успешно изменена!')
    }
  });
  return { mutate };
};
