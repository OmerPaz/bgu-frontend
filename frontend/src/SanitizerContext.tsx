import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SanitizerCtx {
  enabled: boolean;
  toggleSanitizer: () => void;
}

const SanitizerContext = createContext<SanitizerCtx>({
  enabled: true,
  toggleSanitizer: () => {},
});

export const useSanitizer = () => useContext(SanitizerContext);

export const SanitizerProvider = ({ children }: { children: ReactNode }) => {
  const [enabled, setEnabled] = useState<boolean>(true);
  
  const toggleSanitizer = () => setEnabled(!enabled);
  
  return (
    <SanitizerContext.Provider value={{ enabled, toggleSanitizer }}>
      {children}
    </SanitizerContext.Provider>
  );
}; 