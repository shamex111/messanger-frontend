'use client';

import { FC, useEffect } from 'react';
import InviteChat from '@/components/ui/main-layout/main/inviteChat/InviteChat';
import { useInviteContext } from '@/components/ui/main-layout/main/inviteChat/InviteProvider';
import { useRouter } from 'next/navigation';

const Page: FC = () => {
  const { push } = useRouter();
  const { data, setData } = useInviteContext();

  useEffect(() => {
    if (!data.type || data.id === null) {
      push('/'); 
    }
  }, [data, push]);



  return (
    <div>
      {data.type && data.id !== null ? (
        <InviteChat type={data.type} id={data.id} isDiscussion={data.isDiscussion as boolean}/>
      ) : (
        null
      )}
    </div>
  );
};

export default Page;
