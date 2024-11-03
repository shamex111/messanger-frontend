import { useQueries, useQuery } from "@tanstack/react-query";
import { IChatsSearchItem } from "./Chats";
import channelService from "@/services/channel.service";
import groupService from "@/services/group.service";
import chatService from "@/services/chat.service";

export const useChatData = ({ smthId, type }: IChatsSearchItem) => {
  return useQuery({
    queryKey: ['chatData', smthId, type], 
    queryFn: async () => {
      let result;

      switch (type) {
        case 'channel':
          result = (await channelService.getChannel(smthId)).data;
          break;
        case 'group':
          result = (await groupService.getGroup(smthId)).data;
          break;
        case 'chat':
          result = (await chatService.getChat(smthId)).data;
          break;
        default:
          throw new Error('Invalid type');
      }

      return result;
    }
  });
};

export const useChatsData = (allChatIds: IChatsSearchItem[]) => {
  
  const queries = useQueries({
    queries: allChatIds.map(chat => ({
      queryKey: ['chatData', chat.smthId, chat.type],
      queryFn: async () => {
        let result;
        switch (chat.type) {
          case 'channel':
            result = {...(await channelService.getChannel(chat.smthId)).data,type:'channel'};
            break;
          case 'group':
            result = {...(await groupService.getGroup(chat.smthId)).data,type:'group'};
            break;
          case 'chat':
            result = {...(await chatService.getChat(chat.smthId)).data,type:'chat'};
            break;
          default:
            throw new Error('Invalid chat type');
        }
        return result;
      },
      enabled: !!chat.smthId,
    })),
  });

  const isLoading = queries.some(query => query.isLoading);
  const allChats = queries.map(query => query.data).filter(Boolean);
  return { isLoading, allChats };
};
