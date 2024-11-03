import { FC } from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

import Field from '@/components/ui/form-elements/Field/Field';

import { IAuthForm } from '@/types/auth.types';

interface IAuthFields {
  register: UseFormRegister<IAuthForm>;
  errors: {
    username?: FieldError;
    password?: FieldError;
  };
}
const AuthFields: FC<IAuthFields> = ({ register, errors }) => {
  return (
    <div className='flex flex-col gap-3'>
      <Field
        {...register('username', {
          required: 'Имя обязательно!',
          minLength: {
            value: 5,
            message: 'Мин. длина имени 5 символов!'
          },
          maxLength: {
            value: 18,
            message: 'Макс. длина имени 18 символов!'
          }
        })}
        placeholder="Имя"
        title='Имя'
        error={errors.username}
        style={{
          height: 68
        }}
        autoComplete="new-password"
        type="text"
      />
      <Field
        {...register('password', {
          required: 'Пароль обязателен!',
          minLength: {
            value: 6,
            message: 'Мин. длина пароля 6 символов!'
          },
          maxLength: {
            value: 32,
            message: 'Макс. длина пароля 32 символа!'
          }
        })}
        placeholder="Пароль"
        title='Пароль'
        error={errors.password}
        style={{
          height: 68
        }}
        type="password"
      />
    </div>
  );
};

export default AuthFields;
