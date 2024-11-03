import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { IUser, IUserEditFields } from '@/types/user.types';

import ChangeAvatar from './changeAvatar/ChangeAvatar';
import EditSettingsFields from './editSettingsFields/EditSettingsFields';
import { useUserEditMutation } from './useUserEditMutation';

interface IEditSettings {
  user: IUser;
  setIsEdit: any;
}

const EditSettings: FC<IEditSettings> = ({ user, setIsEdit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IUserEditFields>({
    mode: 'onChange'
  });
  const {mutate} = useUserEditMutation()
  const onSubmit: SubmitHandler<IUserEditFields> = data => {
    mutate(data);
  };
  return (
    <div  className=' overflow-y-auto' style={{
      maxHeight:'calc(100vh - 71px)'
    }}>
      <ChangeAvatar user={user} setIsEdit={setIsEdit} />
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
        <EditSettingsFields register={register} errors={errors} />
        </form>
      </div>
    </div>
  );
};

export default EditSettings;
