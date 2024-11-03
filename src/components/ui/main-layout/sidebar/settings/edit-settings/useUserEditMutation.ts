import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import userService from '@/services/user.service';

import { IUserEditFields } from '@/types/user.types';

export const useUserEditMutation = () => {
  const { mutate } = useMutation({
    mutationKey: ['user-edit'],
    mutationFn: (data: IUserEditFields) => userService.editUser(data),
    onSuccess() {
      toast.success('Данные успешно измененны!');
    },
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
