export const sortChatsFn = (allChats: Array<any>) => {
    return allChats
      .sort((a, b) => {
        if (!a.messages?.length) return 1;
        if (!b.messages?.length) return -1;
  
        const dateA = new Date(a.messages[0].createdAt).getTime();
        const dateB = new Date(b.messages[0].createdAt).getTime();
  
        return dateB - dateA;
      });
  };
  