import { useQuery } from '@tanstack/react-query';

import userService from '@/services/user.service';

export const useProfile = () => {
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['get user'],
    queryFn: () => userService.getProfile(),
    select: ({data}) => data
  });
  return { user, isLoading,refetch };
};
