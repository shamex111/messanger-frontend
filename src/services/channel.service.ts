import { ApiError } from 'next/dist/server/api-utils';

import { axiosWithAuth } from '@/api/interceptors';

import { API_URl } from '@/config/api.config';

import {
  IAssignRole,
  IChangeNotifications,
  IChannelEdit,
  IChannelForm,
  IChannelRole,
  IDeleteRole,
  IEditRole
} from '@/types/channel.types';

class ChannelService {
  async getChannel(id: number) {
    return axiosWithAuth.get(API_URl.channel(`${id}`));
  }
  async getChannelForInvite(id: number) {
    return axiosWithAuth.get(API_URl.channel(`for-invite/${id}`));
  }
  async getNotification(data: {
    memberId: number;
    smthId: number;
    type: 'channel' | 'group';
  }) {
    return axiosWithAuth.post(API_URl.notification(), data);
  }

  async searchChannel(param: string) {
    return axiosWithAuth.get(API_URl.channel(`search-channels/${param}`));
  }

  async createChannel(data: IChannelForm) {
    return axiosWithAuth.post(API_URl.channel(), data);
  }

  async editChannel(data: IChannelEdit) {
    return axiosWithAuth.patch(API_URl.channel(), data);
  }

  async deleteChannel(id: number) {
    return axiosWithAuth.delete(API_URl.channel(`${id}`));
  }

  async addMember(data: { userId: number; channelId: number }) {
    return axiosWithAuth.post(API_URl.channel('members/add-member'), data);
  }

  async join(data: { channelId: number }) {
    return axiosWithAuth.post(API_URl.channel('members/join'), data);
  }

  async deleteMember(data: { userId: number; channelId: number }) {
    return axiosWithAuth.delete(
      `${API_URl.channel('members/delete-member')}?userId=${data.userId}&channelId=${data.channelId}`
    );
  }

  async createRole(data: any) {
    return axiosWithAuth.post(API_URl.channel('roles/create-role'), data);
  }

  async removeRole(data: { userId: number; channelId: number }) {
    return axiosWithAuth.patch(API_URl.channel('roles/remove-role'), data);
  }

  async assignRole(data: IAssignRole) {
    return axiosWithAuth.patch(API_URl.channel('roles/assign-role'), data);
  }

  async editRole(data: IEditRole) {
    return axiosWithAuth.patch(API_URl.channel('roles/edit-role'), data);
  }

  async deleteRole(data: IDeleteRole) {
    return axiosWithAuth.delete(
      `${API_URl.channel('roles/delete-role')}?roleName=${data.roleName}&channelId=${data.channelId}`
    );
  }

  async createDiscussion(data: { channelId: number }) {
    return axiosWithAuth.post(API_URl.channel('create-discussion'), data);
  }

  async deleteDiscussion(channelId: number) {
    return axiosWithAuth.delete(
      API_URl.channel(`delete-discussion/${channelId}`)
    );
  }

  async listMembers(channelId: number) {
    return axiosWithAuth.get(API_URl.channel(`list-members/${channelId}`));
  }

  async listRoles(channelId: number) {
    return axiosWithAuth.get(API_URl.channel(`list-roles/${channelId}`));
  }

  async listPermissions() {
    return axiosWithAuth.get(API_URl.channel('permissions/list-permissions'));
  }

  async changeNotifications(data: IChangeNotifications) {
    return axiosWithAuth.patch(API_URl.channel('change-notifications'), data);
  }
}

export default new ChannelService();
