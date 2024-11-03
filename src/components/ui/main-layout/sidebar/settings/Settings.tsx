"use client";

import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import userService from "@/services/user.service";

import { IUser } from "@/types/user.types";

import socketService from "@/socketService";

import EditSettings from "./edit-settings/EditSettings";
import InfoSettings from "./info-settings/InfoSettings";
import { useStores } from "@/components/ui/chatStoreProvider";
import { observer } from "mobx-react-lite";

interface ISettings {
  isEdit: boolean;
  setIsEdit: any;
}

const Settings: FC<ISettings> = observer(({ isEdit, setIsEdit }) => {
  const { userStore } = useStores();

  useEffect(() => {
    const handleUserUpdate = async () => {
      try {
        const profile = await userService.getProfile();
        userStore.saveProfile(profile.data);
        console.log("Профиль пользователя обновлен");
      } catch (error) {
        console.error("Не удалось обновить профиль пользователя:", error);
      }
    };

    socketService.onEditUser(handleUserUpdate);

    return () => {
      socketService.offEditUser(() => null);
    };
  }, []);

  return (
    <div className="h-full">
      {!isEdit ? (
        <InfoSettings user={userStore.user as IUser} />
      ) : (
        <EditSettings user={userStore.user as IUser} setIsEdit={setIsEdit} />
      )}
    </div>
  );
})

export default Settings;
