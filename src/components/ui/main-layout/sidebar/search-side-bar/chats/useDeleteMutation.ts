import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import channelService from '@/services/channel.service';
import chatService from '@/services/chat.service';
import groupService from '@/services/group.service';

import { TSmthType } from '@/socketService';

export const useDeleteMutation = () => {
  const { mutate } = useMutation({
    mutationKey: ['delete chat'],
    mutationFn: async (payload: {
      type: TSmthType;
      smthId: number;
      userId?: number;
    }) => {
      try {
        if (payload.type === 'channel') {
          return await channelService.deleteMember({
            userId: payload.userId as number,
            channelId: payload.smthId,
          });
        } else if (payload.type === 'group') {
          return await groupService.deleteMember({
            userId: payload.userId as number,
            groupId: payload.smthId,
          });
        } else if (payload.type === 'chat') {
          return await chatService.deleteChat(payload.smthId);
        } else {
          throw new Error('Неверный тип');
        }
      } catch (error) {
        throw error;
      }
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

export default useDeleteMutation;
