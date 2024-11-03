import { useMutation } from '@tanstack/react-query';

import channelService from '@/services/channel.service';
import chatService from '@/services/chat.service';
import groupService from '@/services/group.service';

import { IChannelForm } from '@/types/channel.types';
import { IChatForm } from '@/types/chat.types';
import { IGroupForm } from '@/types/group.types';

import { TSmthType } from '@/socketService';
import toast from 'react-hot-toast';

export const useCreateChatMutation = () => {
  const { mutate } = useMutation({
    mutationKey: ['create chat'],
    mutationFn: (data: {
      data: IChatForm | IChannelForm | IGroupForm;
      type: TSmthType;
    }) => {
      if (data.type === 'chat') {
        return chatService.createChat({
          user1Id: (data.data as IChatForm).user1Id,
          user2Id: (data.data as IChatForm).user2Id
        });
      } else if (data.type === 'channel') {
        return channelService.createChannel({
          name: (data.data as IChannelForm).name,
          description: (data.data as IChannelForm).description,
          avatar: (data.data as IChannelForm).avatar,
          private: (data.data as IChannelForm).private
        });
      } else {
        return groupService.createGroup({
          name: (data.data as IGroupForm).name,
          description: (data.data as IGroupForm).description,
          avatar: (data.data as IGroupForm).avatar,
          private: (data.data as IGroupForm).private
        });
      }
    },
 
    onError(error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Ошибка');
      }
    }
  });
  return { mutate };
};
