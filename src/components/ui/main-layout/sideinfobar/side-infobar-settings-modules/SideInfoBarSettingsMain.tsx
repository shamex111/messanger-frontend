'use client';

import { FC, useState } from 'react';

import { useStores } from '@/components/ui/chatStoreProvider';

import { IChannel, IChannelMember, IPermission } from '@/types/channel.types';
import { IGroup, IGroupMember } from '@/types/group.types';

import DiscussionModule from './DiscussionModule';
import MembersModule from './MembersModule';
import PrivateModule from './PrivateModule';
import RolesModules from './RolesModules';
import SideInfoBarSettings from './SideInfoBarSettings';

interface ISideInfoBarSettingsMain {
  setIsSettings: any;
  chat: IChannel | IGroup;
}

const SideInfoBarSettingsMain: FC<ISideInfoBarSettingsMain> = ({
  setIsSettings,
  chat
}) => {
  const [moduleType, setModuleType] = useState<
    'main' | 'private' | 'discussion' | 'roles' | 'members'
  >('main');
  const { userStore,chatStore } = useStores();
  let member;
  // if (chat.type === 'group')
  //   member = userStore.user?.groupMembers?.find(i => i.groupId === chat.id);
  // else if (chat.type === 'channel')
  //   member = userStore.user?.channelMembers?.find(i => i.channelId === chat.id);
  member = chatStore.allChats
  .find(i => i.type === chat.type && i.id === chat.id)
  ?.members?.find((i: any) => i.user.id === userStore.user?.id);
  return (
    <div className="h-full overflow-y-auto">
      {moduleType === 'main' ? (
        <SideInfoBarSettings
          setIsOpen={setIsSettings}
          name={(chat as IChannel | IGroup).name}
          description={(chat as IChannel | IGroup).description}
          id={chat.id as number}
          type={chat.type as 'group' | 'channel'}
          isPrivate={(chat as IChannel | IGroup).private}
          defaultAvatar={(chat as IChannel | IGroup).avatar}
          setModuleType={setModuleType}
          chat={chat}
        />
      ) : moduleType === 'private' ? (
        (
          chat.type === 'channel'
            ? (member as IChannelMember).channelRole.permissions.find(
                i => i.permission.action === 'edit'
              )
            : (member as IGroupMember).groupRole.permissions.find(
                i => i.permission.action === 'edit'
              )
        ) ? (
          <PrivateModule
          chat={chat}
            setModuleType={setModuleType}
            type={chat.type as 'group' | 'channel'}
            defaultValue={chat.private}
          />
        ) : null
      ) : moduleType === 'discussion' ? (
        (member as IChannelMember).channelRole.permissions.find(
          i => i.permission.action === 'changeDiscussion'
        ) ? (
          <DiscussionModule
            setModuleType={setModuleType}
            channelId={chat.id as number}
            discussion={(chat as IChannel).discussion}
          />
        ) : null
      ) : moduleType === 'roles' ? (
        (
          chat.type === 'channel'
            ? (member as IChannelMember).channelRole.permissions.find(
                i => i.permission.action === 'changeRole'
              )
            : (member as IGroupMember).groupRole.permissions.find(
                i => i.permission.action === 'changeRole'
              )
        ) ? (
          <RolesModules setModuleType={setModuleType} chat={chat} />
        ) : null
      ) : (
          chat.type === 'channel'
            ? (member as IChannelMember).channelRole.permissions.find(
                i =>
                  i.permission.action === 'removeMember' ||
                  i.permission.action === 'changeRole'
              )
            : (member as IGroupMember).groupRole.permissions.find(
                i =>
                  i.permission.action === 'removeMember' ||
                  i.permission.action === 'changeRole'
              )
        ) ? (
        <MembersModule setModuleType={setModuleType} chat={chat} />
      ) : null}
    </div>
  );
};

export default SideInfoBarSettingsMain;
