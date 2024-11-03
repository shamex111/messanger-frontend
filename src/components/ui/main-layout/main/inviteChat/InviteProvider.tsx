'use client';

import React, { ReactNode, createContext, useContext, useState } from 'react';

interface ContextType {
  data: {
    type: 'group' | 'channel' | null;
    id: number | null;
    isDiscussion?: boolean | null;
  };
  setData: (newData: {
    type: 'group' | 'channel' | null;
    id: number | null;
    isDiscussion: boolean | null;
  }) => void;
}

const DataContext = createContext<ContextType>({
  data: { type: null, id: null, isDiscussion: null },
  setData: () => {}
});

export const useInviteContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error(
      'useDataContext должен использоваться внутри InviteDataProvider'
    );
  }
  return context;
};

export const InviteDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<{
    type: 'group' | 'channel' | null;
    id: number | null;
  }>({
    type: null,
    id: null
  });

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};
