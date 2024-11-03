import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import channelService from '@/services/channel.service';
import groupService from '@/services/group.service';

export const useCreateRoleMutation = () => {
  const { mutate } = useMutation({
    mutationKey: ['create role'],
    mutationFn: async (data: {
      smthId: number;
      type: 'group' | 'channel';
      data: {
        color: string;
        name: string;
        permissionNames: any[];
      };
    }) => {
      if (data.type === 'channel') {
        return await channelService.createRole({
          ...data.data,
          channelId: data.smthId
        });
      } else {
        return await groupService.createRole({
          ...data.data,
          groupId: data.smthId
        });
      }
    },
    onSuccess: () => {
      toast.success('Роль успешно создана!');
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
