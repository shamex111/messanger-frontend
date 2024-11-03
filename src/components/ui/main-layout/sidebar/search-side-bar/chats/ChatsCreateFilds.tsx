import { FC } from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

import Field from '@/components/ui/form-elements/Field/Field';

import { IChannelForm } from '@/types/channel.types';

interface IChatsCreateFields {
  register: UseFormRegister<IChannelForm>;
  errors: {
    description?: FieldError;
    name?: FieldError;
  };
  defaultValues?:{
    description?:string,
    name?:string,
  }
}
const ChatsCreateFields: FC<IChatsCreateFields> = ({ register, errors,defaultValues }) => {
  return (
    <div className="flex flex-col gap-3">
      <Field
        {...register('name', {
          required: 'Имя обязательно!',
          minLength: {
            value: 1,
            message: 'Мин. длина названия 1 символов!'
          },
          maxLength: {
            value: 48,
            message: 'Макс. длина названия 48 символов!'
          }
        })}
        placeholder='Название'
        // title="Название"
        defaultValue={defaultValues?.name ? defaultValues.name : ''}
        error={errors.name}
        style={{
          height: 55,
          width: '85%',
          margin: '0 auto'
        }}
        // autoComplete="new-password"
        type="text"
      />
      <Field
        {...register('description', {
          maxLength: {
            value: 256,
            message: 'Макс. длина описания 256 символов!'
          }
        })}
        placeholder="Описание (опционально)"
        // title="Описание(необязательно)"
        error={errors.description}
        defaultValue={defaultValues?.description ? defaultValues.description : ''}
        style={{
          height: 55,
          width: '85%',
          margin: '0 auto'
        }}
        type="text"
      />
    </div>
  );
};

export default ChatsCreateFields;
