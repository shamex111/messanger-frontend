import Field from "@/components/ui/form-elements/Field/Field";
import { IUserEditFields } from "@/types/user.types";
import { FC } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { IoMdCheckmark } from "react-icons/io";

interface IEditSettingsFields {
  register: UseFormRegister<IUserEditFields>;
  errors: {
    username?: FieldError;
    name?: FieldError;
    description?: FieldError;
  };
}

const EditSettingsFields: FC<IEditSettingsFields> = ({ register, errors }) => {
  return (
    <div>
      <div className="flex flex-col gap-3 w-[85%] mt-10 mx-auto">
        <Field
          {...register("name", {
            required: "Имя обязательно!",
            minLength: {
              value: 1,
              message: "Мин. длина имени 5 символов!",
            },
            maxLength: {
              value: 24,
              message: "Макс. длина имени 18 символов!",
            },
          })}
          placeholder="Имя"
          title="Имя(обязательно)"
          error={errors.name}
          style={{
            height: 52,
          }}
          type="text"
        />

        <Field
          {...register("description", {
            maxLength: {
              value: 48,
              message: "Макс. длина описания 18 символов!",
            },
          })}
          placeholder="О себе"
          title="Описание(не обязательно)"
          error={errors.description}
          style={{
            height: 52,
          }}
          type="text"
        />
        <div className="text-sm text-gray mt-3 ml-3 ">
          <div>
            Любые подробности, например: возраст, род занятий или город.
          </div>
          <div className="mt-2">
            Пример: 23 года, дизайнер из Санкт-Петербурга.
          </div>
        </div>
      </div>
      <div className="w-[95%] h-[10px] bg-slate-950 mt-6"></div>
      <div className="w-[90%] mt-5 mx-auto flex flex-col gap-4 mb-3 lg:mb-12 xl:mb-32 ">
        <div className="text-gray font-semibold">Имя пользователя</div>
        <Field
          {...register("username", {
            required: "Имя пользователя обязательно!",
            minLength: {
              value: 5,
              message: "Мин. длина имени 5 символов!",
            },
            maxLength: {
              value: 24,
              message: "Макс. длина имени 18 символов!",
            },
          })}
          placeholder="Имя"
          title="Имя пользователя"
          error={errors.username}
          style={{
            height: 52,
          }}
          type="text"
        />
        <div className="text-gray text-sm ml-3">
          Вы можете выбрать свое публичное имя пользователя по которому другие
          пользователи смогут находить вас.
        </div>
        <div className="text-gray text-sm ml-3">
          Минимальная длина 5 символов.
        </div>
      </div>
      <button className="ml-auto mb-3 mr-7 w-[55px] h-[55px] rounded-full bg-accent flex cursor-pointer hover:shadow-md  duration-500 hover:shadow-accent ">
        <IoMdCheckmark className="m-auto text-2xl" />
      </button>
    </div>
  );
};

export default EditSettingsFields;
