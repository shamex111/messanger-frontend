// context/ChatStoreContext.tsx
import React, { createContext, useContext } from 'react';

import chatStore from '@/stores/chatStore';
import userStore from '@/stores/userStore';

const StoresContext = createContext({ chatStore, userStore });

export const StoreProvider = ({ children }: any) => (
  <StoresContext.Provider value={{ chatStore, userStore }}>
    {children}
  </StoresContext.Provider>
);

export const useStores = () => useContext(StoresContext);
