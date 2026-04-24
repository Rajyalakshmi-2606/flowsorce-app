import React, { PropsWithChildren, createContext } from "react";

// Placeholder context for session, replace with your own auth logic if needed
export const SessionContext = createContext<null>(null);

const SessionProviderWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return <SessionContext.Provider value={null}>{children}</SessionContext.Provider>;
};

export default SessionProviderWrapper;
