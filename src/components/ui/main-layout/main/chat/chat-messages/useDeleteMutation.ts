import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import messageService from '@/services/message.service';

export const useDeleteMutation = () => {
  const { mutate } = useMutation({
    mutationKey: ['delete message'],
    mutationFn: (id: number) => messageService.deleteMessage(id),
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
