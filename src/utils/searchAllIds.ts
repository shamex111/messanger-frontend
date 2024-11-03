import { TSmthType } from "@/socketService";
import { IChannelMember } from "@/types/channel.types";
import { IChat } from "@/types/chat.types";
import { IGroupMember } from "@/types/group.types";
import { IUser } from "@/types/user.types";

export const searchAllIds = (profile: IUser | null) => {
  if (profile) {
    const channelIds = (profile.channelMembers as Array<IChannelMember>).map(
      (i: IChannelMember) => i.channelId
    );
    const groupIds = (profile.groupMembers as Array<IGroupMember>).map(
      (i: IGroupMember) => i.groupId
    );
    const personalChatIds = [
      ...(profile.personalChats as Array<IChat>).map((i: any) => i.id),
      ...(profile.personalChats2 as Array<IChat>).map((i: any) => i.id),
    ];

    const allIds = [
      ...channelIds.map((id) => ({
        smthId: id,
        type: "channel" as TSmthType,
      })),
      ...groupIds.map((id) => ({ smthId: id, type: "group" as TSmthType })),
      ...personalChatIds.map((id) => ({
        smthId: id,
        type: "chat" as TSmthType,
      })),
    ];
    return allIds;
  }
  return []
};
