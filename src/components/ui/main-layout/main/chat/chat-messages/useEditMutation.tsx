import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import messageService from '@/services/message.service';

export const useEditMutation = () => {
  const { mutate } = useMutation({
    mutationKey: ['edit message'],
    mutationFn: (data: { id: number; content: string }) =>
      messageService.editMessage(data.id, { content: data.content }),
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
