import { useQuery } from '@tanstack/react-query';

import channelService from '@/services/channel.service';
import groupService from '@/services/group.service';

export const useNotificationQuery = (dto: any) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['findNotification', dto.smthId, dto.type],
    queryFn: async () => {
      if (dto.type === 'channel') {
        return channelService.getNotification(dto);
      }
      if (dto.type === 'group') {
        return groupService.getNotification(dto);
      }
      throw new Error('Unsupported notification type');
    },
    enabled: !!dto.smthId && !!dto.type && !!dto.memberId,
  });

  return { isLoading, data, error };
};
