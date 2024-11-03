import { useQuery } from '@tanstack/react-query';

import channelService from '@/services/channel.service';
import groupService from '@/services/group.service';

export const useChatsQuery = (dto: {
  id: number;
  type: 'channel' | 'group';
}) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['get chats', dto.type, dto.id],
    queryFn: async () => {
      if (dto.type === 'channel') {
        return await channelService.getChannelForInvite(dto.id);
      } else {
        return await groupService.getGroupForInvite(dto.id);
      }
    },
    enabled: !!dto.id
  });

  return { isLoading, data, error };
};
