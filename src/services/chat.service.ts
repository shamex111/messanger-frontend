import { axiosWithAuth } from '@/api/interceptors';

import { API_URl } from '@/config/api.config';

import { IChat, IChatForm } from '@/types/chat.types';

class ChatService {
  async getChat(id:number){
    return axiosWithAuth.get(API_URl.chat(`${id}`))
  };

  async createChat(data: IChatForm) {
    return axiosWithAuth.post<IChat>(API_URl.chat(), data);
  }
  async deleteChat(chatId: number) {
    return axiosWithAuth.delete<IChat>(API_URl.chat(`${chatId}`));
  }
}

export default new ChatService();
