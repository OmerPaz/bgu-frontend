import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SanitizerCtx {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
}

const SanitizerContext = createContext<SanitizerCtx>({
  enabled: true,
  setEnabled: () => {},
});

export const useSanitizer = () => useContext(SanitizerContext);

export const SanitizerProvider = ({ children }: { children: ReactNode }) => {
  const [enabled, setEnabled] = useState<boolean>(true);
  return (
    <SanitizerContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </SanitizerContext.Provider>
  );
}; 