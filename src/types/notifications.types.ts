interface INotificationsBase {
  count: number;
}

export interface IChatNotifications extends INotificationsBase {
  userId: number;
  chatId: number;
}

export interface IChannelNotifications extends INotificationsBase {
  memberId: number;
  channelId: number;
}

export interface IGroupNotifications extends INotificationsBase {
  memberId: number;
  groupId: number;
}
