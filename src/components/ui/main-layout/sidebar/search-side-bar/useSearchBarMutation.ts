import { useQuery } from '@tanstack/react-query';

import channelService from '@/services/channel.service';
import groupService from '@/services/group.service';
import userService from '@/services/user.service';

import { TSearchType } from './SearchSideBar';

export const useSearchBarQuery = (type: TSearchType, param: string) => {
  const { data, isLoading, error,refetch } = useQuery({
    queryKey: ['search', type, param], 
    queryFn: async () => {
      if (!param) {
        throw new Error('Search parameter is required.');
      }
      switch (type) {
        case 'Пользователи':
          return await userService.searchUsers(param);
        case 'Группы':
          return await groupService.searchGroup(param);
        case 'Каналы':
          return await channelService.searchChannel(param);
        default:
          throw new Error('Invalid search type.');
      }
    },
    enabled: !!param, 
    select: (response) => response.data, 
  });

  return { data, isLoading, error,refetch };
};
