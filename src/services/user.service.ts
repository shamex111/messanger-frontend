import { axiosWithAuth } from '@/api/interceptors';

import { API_URl } from '@/config/api.config';

import { IAuthForm } from '@/types/auth.types';
import { IUser, IUserEdit } from '@/types/user.types';

class UserService {
  async searchUsers(param: string) {
    return axiosWithAuth.get(API_URl.user(`search-users/${param}`));
  }
  async getUser(username: string) {
    return axiosWithAuth.get<IUser>(API_URl.user(username));
  }
  async getUserById(id: number) {
    return axiosWithAuth.get<IUser>(API_URl.user(`by-id/${id}`));
  }
  async createUser(data: IAuthForm) {
    return axiosWithAuth.post<IUser>(API_URl.user(), data);
  }
  async editUser(data: IUserEdit) {
    return axiosWithAuth.patch<IUser>(API_URl.user(), data);
  }
  async deleteUser() {
    return axiosWithAuth.delete<IUser>(API_URl.user());
  }
  async updateLastOnline() {
    return axiosWithAuth.patch<IUser>(API_URl.user('update-last-online'));
  }
  async setOnlineStatus(action: 'online' | 'offline') {
    return axiosWithAuth.patch(API_URl.user('set-online-status'), { action });
  }
  async getProfile() {
    return axiosWithAuth.get<IUser>(API_URl.user('profile'));
  }
}

export default new UserService();
