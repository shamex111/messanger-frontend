import { useMutation } from '@tanstack/react-query';
import { register } from 'module';
import { useRouter } from 'next/navigation';
import { UseFormReset } from 'react-hook-form';
import toast from 'react-hot-toast';

import { PUBLIC_URl } from '@/config/url.config';

import authService from '@/services/auth/auth.service';

import { IAuthForm } from '@/types/auth.types';

export const useAuthMutation = (
  isLoginForm: boolean,
  reset: UseFormReset<IAuthForm>
) => {
  const { push, refresh } = useRouter();

  const { mutate } = useMutation({
    mutationKey: ['auth'],
    mutationFn: (data: IAuthForm) =>
      authService.main(isLoginForm ? 'login' : 'register', data),
    onSuccess() {
      reset();
      push(PUBLIC_URl.home());
      refresh();
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
