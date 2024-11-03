import { axiosWithAuth } from '@/api/interceptors';

import { API_URl } from '@/config/api.config';

import {
  IAssignRole,
  IChangeNotifications,
  IDeleteRole,
  IEditRole,
  IGroupEdit,
  IGroupForm,
  IGroupRole
} from '@/types/group.types';

class GroupService {
  async getGroup(id: number) {
    return axiosWithAuth.get(API_URl.group(`${id}`));
  }
  async getGroupForInvite(id: number) {
    return axiosWithAuth.get(API_URl.group(`for-invite/${id}`));
  }
  async getNotification(data: {
    memberId: number;
    smthId: number;
    type: 'channel' | 'group';
  }) {
    return axiosWithAuth.post(API_URl.notification(), data);
  }

  async searchGroup(param: string) {
    return axiosWithAuth.get(API_URl.group(`search-groups/${param}`));
  }

  async createGroup(data: IGroupForm) {
    return axiosWithAuth.post(API_URl.group(), data);
  }

  async editGroup(data: IGroupEdit) {
    return axiosWithAuth.patch(API_URl.group(), data);
  }

  async deleteGroup(groupId: number) {
    return axiosWithAuth.delete(API_URl.group(), { data: { groupId } });
  }

  async addMember(data: { userId: number; groupId: number }) {
    return axiosWithAuth.post(API_URl.group('members/add-member'), data);
  }

  async join(data: { groupId: number ,isDiscussion?:boolean}) {
    return axiosWithAuth.post(API_URl.group('members/join'), data);
  }

  async deleteMember(data: { userId: number; groupId: number }) {
    return axiosWithAuth.delete(API_URl.group('members/delete-member'), {
      data
    });
  }

  async createRole(data: any) {
    return axiosWithAuth.post(API_URl.group('roles/create-role'), data);
  }

  async removeRole(data: { userId: number; groupId: number }) {
    return axiosWithAuth.patch(API_URl.group('roles/remove-role'), data);
  }

  async assignRole(data: IAssignRole) {
    return axiosWithAuth.patch(API_URl.group('roles/assign-role'), data);
  }

  async editRole(data: IEditRole) {
    return axiosWithAuth.patch(API_URl.group('roles/edit-role'), data);
  }

  async deleteRole(data: IDeleteRole) {
    return axiosWithAuth.delete(API_URl.group('roles/delete-role'), { data });
  }

  async listMembers(groupId: number) {
    return axiosWithAuth.get(API_URl.group(`list-members/${groupId}`));
  }

  async listRoles(groupId: number) {
    return axiosWithAuth.get(API_URl.group(`list-roles/${groupId}`));
  }

  async listPermissions() {
    return axiosWithAuth.get(API_URl.group('permissions/list-permissions'));
  }

  async changeNotifications(data: IChangeNotifications) {
    return axiosWithAuth.patch(API_URl.group('change-notifications'), data);
  }
}

export default new GroupService();
