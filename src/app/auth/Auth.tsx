'use client';

import { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { IAuthForm } from '@/types/auth.types';

import styles from './Auth.module.scss';
import AuthFields from './AuthFields';
import { useAuthMutation } from './useAuthMutation';

const Auth: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IAuthForm>({
    mode: 'onChange'
  });
  const [isLoginForm, setIsLoginForm] = useState(false);

  const { mutate } = useAuthMutation(isLoginForm, reset);

  const onSubmit: SubmitHandler<IAuthForm> = data => {
    mutate(data);
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>
        {isLoginForm ? 'Войти' : 'Сперва регистрация'}
      </h1>
      <form
        className="flex flex-col"
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <AuthFields register={register} errors={errors} />
        <button
          type="button"
          onClick={() => setIsLoginForm(!isLoginForm)}
          className={styles.changeButton}
        >
          {isLoginForm ? 'Еще нет аккаунта?' : 'Уже есть аккаунт?'}
        </button>
        <button className={styles.button} type="submit">
          {isLoginForm ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
};

export default Auth;
