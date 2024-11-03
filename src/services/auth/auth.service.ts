import Cookies from 'js-cookie';

import { axiosForAuth } from '@/api/interceptors';

import { API_URl } from '@/config/api.config';

import { IAuthForm, IAuthResponse } from '@/types/auth.types';

import { EnumTokens, saveToStorage } from './auth-token.service';

class AuthService {
  async main(type: 'login' | 'register', data: IAuthForm) {
    const response = await axiosForAuth.post<IAuthResponse>(
      API_URl.auth(`${type}`),
      data
    );
    if (response.data.accessToken) saveToStorage(response.data);

    return response;
  }
  async getNewTokens() {
    const refreshToken = Cookies.get(EnumTokens.REFRESH_TOKEN);
    const response = await axiosForAuth.post<string, { data: IAuthResponse }>(
      API_URl.auth(`login/access-token`),
      { refreshToken }
    );
    if (response.data.accessToken) saveToStorage(response.data);

    return response;
  }
}

export default new AuthService();
//dd