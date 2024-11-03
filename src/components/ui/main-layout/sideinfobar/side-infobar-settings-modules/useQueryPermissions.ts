import { useQuery } from '@tanstack/react-query';

import channelService from '@/services/channel.service';

import { IPermission } from '@/types/channel.types';

export const usePermissionsQuery = () => {
  const { isLoading, data, error } = useQuery<IPermission[], Error>({
    queryKey: ['getPermissions'],
    queryFn: async () => {
      const response = await channelService.listPermissions();
      return response.data;
    },

    staleTime: 1000 * 60 * 60
  });

  return { isLoading, data, error };
};
