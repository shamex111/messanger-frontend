import Cookies from 'js-cookie';
import { IAuthResponse, ITokens } from '../../types/auth.types';

export enum EnumTokens {
  'ACCESS_TOKEN' = 'accessToken',
  'REFRESH_TOKEN' = 'refreshToken'
}

export enum EnumStorage {
  'USER' = 'user'
}

// Получение accessToken из Cookies
export const getAccessToken = () => {
  const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN);
  return accessToken || null;
};

// Получение данных пользователя из localStorage
export const getUserFromStorage = () => {
  const user = localStorage.getItem(EnumStorage.USER);
  return user ? JSON.parse(user) : null;
};

// Сохранение токенов в Cookies
export const saveTokensStorage = (data: ITokens) => {
  Cookies.set(EnumTokens.ACCESS_TOKEN, data.accessToken);
  Cookies.set(EnumTokens.REFRESH_TOKEN, data.refreshToken);
};

// Удаление токенов из Cookies
export const removeFromStorage = () => {
  Cookies.remove(EnumTokens.ACCESS_TOKEN);
  Cookies.remove(EnumTokens.REFRESH_TOKEN);
  localStorage.removeItem(EnumStorage.USER); // Удаляем также данные пользователя
};

// Сохранение токенов и пользователя в localStorage
export const saveToStorage = (data: IAuthResponse) => {
  saveTokensStorage(data);
  localStorage.setItem(EnumStorage.USER, JSON.stringify(data.user));
};
