import { axiosWithAuth } from '@/api/interceptors';

import { API_URl } from '@/config/api.config';
import { TSmthType } from '@/socketService';

import {
  IAttachment,
  IMessageBase,
  IMessageChannel,
  IMessageEdit,
  IMessageForm
} from '@/types/message.types';

class MessageService {
  async createMessage(data: IMessageForm) {
    return axiosWithAuth.post<any>(API_URl.message(), data);
  }
  async getMessage(data: {
    lastMessageId: number;
    count: number;
    smthId: number;
    type:TSmthType
  }) {
    return axiosWithAuth.post<IMessageBase[]>(API_URl.message('get-messages'), data);
  }
  async editMessage(id: number, data: IMessageEdit) {
    return axiosWithAuth.patch<IMessageBase>(API_URl.message(`${id}`), data);
  }
  async deleteMessage(id: number) {
    return axiosWithAuth.delete<IMessageBase>(API_URl.message(`${id}`));
  }
  async markAsRead(id: number) {
    return axiosWithAuth.patch(API_URl.message(`read-message/${id}`));
  }
  async attachment(data: IAttachment) {
    return axiosWithAuth.post(API_URl.message('attachment'), data);
  }
}

export default new MessageService();
