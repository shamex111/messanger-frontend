import { useQuery } from '@tanstack/react-query';
import messageService from '@/services/message.service';
import { TSmthType } from '@/socketService';

export const useMessageQuery = (dto: {
  lastMessageId: number | null;
  count: number | null;
  smthId: number | null;
  type: TSmthType | null;
}) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['get messages', dto],
    queryFn: async () => {
      if (dto.count && dto.lastMessageId && dto.smthId && dto.type) {
        return await messageService.getMessage({
          lastMessageId: dto.lastMessageId,
          count: dto.count,
          smthId: dto.smthId,
          type: dto.type
        });
      }

      return null;
    },
    enabled: !!dto.smthId && !!dto.type 
  });

  return { isLoading, data, error };
};
