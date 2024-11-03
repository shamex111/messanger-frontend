import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import channelService from '@/services/channel.service';
import groupService from '@/services/group.service';

const useJoinMutation = (
  type: 'group' | 'channel',
  id: number,
  isDiscussion?: boolean
) => {
  const { push } = useRouter();

  const joinMutation = useMutation({
    mutationFn: async () => {
      if (type === 'group') {
        console.log(id);
        await groupService.join({ groupId: id, isDiscussion: isDiscussion });
      } else if (type === 'channel') {
        await channelService.join({ channelId: id });
      }
    },
    onSuccess: () => {
      push(`/${type}/${id}`);
      toast(`Вы вступили в ${type === 'group' ? 'группу' : 'канал'}`, {
        icon: 'ⓘ'
      });
    },
    onError: error => {
      toast.error('Ошибка при попытке вступить в чат');
    }
  });

  return joinMutation;
};

export default useJoinMutation;
