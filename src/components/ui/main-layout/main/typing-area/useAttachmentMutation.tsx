import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import messageService from '@/services/message.service';

import { IAttachment } from '@/types/message.types';

export const useAttachmentMutation = () => {
  const { mutate } = useMutation({
    mutationKey: ['attachment media'],
    mutationFn: (data: IAttachment) => messageService.attachment(data),
    onError(error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Ошибка');
      }
    }
  });
  return {mutate}
};
