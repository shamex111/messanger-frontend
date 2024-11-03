import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EditContextType {
  isEditMessageId: number | null;
  setIsEdit: (value: number | null) => void;
}

const EditContext = createContext<EditContextType>({
  isEditMessageId: null,
  setIsEdit: () => {},
});

export const EditProvider = ({ children }: { children: ReactNode }) => {
  const [isEditMessageId, setIsEdit] = useState<number | null>(null);

  return (
    <EditContext.Provider value={{ isEditMessageId, setIsEdit }}>
      {children}
    </EditContext.Provider>
  );
};

export const useEdit = () => useContext(EditContext);
