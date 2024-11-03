import { useMutation } from '@tanstack/react-query';
import channelService from '@/services/channel.service';
import groupService from '@/services/group.service';
import toast from 'react-hot-toast';

interface IMutationData {
  userId: number;
  smthId: number;
  type: 'group' | 'channel';
}

export const addMemberMutate = () => {
  const { mutate } = useMutation({
    mutationKey: ['add member'],
    mutationFn: async (data: IMutationData) => {
      if (data.type === 'channel') {
        return await channelService.addMember({
          userId: data.userId,
          channelId: data.smthId
        });
      } else if (data.type === 'group') {
        return await groupService.addMember({
          userId: data.userId,
          groupId: data.smthId
        });
      }
    },
    onError: (error: any) => {
      toast.error('Ошибка при добавлении участника:', error);
    }
  });

  return { mutate };
};

export default addMemberMutate;
