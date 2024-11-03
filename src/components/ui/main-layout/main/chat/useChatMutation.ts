import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import messageService from '@/services/message.service';

export const useChatMutation = () => {
  const { mutate } = useMutation({
    mutationKey: ['read message'],
    mutationFn: async (id: number) => {
      console.log('1221')
      return await messageService.markAsRead(id);
    },
    onError: error => {
      toast.error(error.message);
    }
  });
  return { mutate };
};
