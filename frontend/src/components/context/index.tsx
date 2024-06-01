import { createContext, useContext, useMemo, useState } from "react";
import { UserResponse } from "@/utils/auth";

export interface CustomProps {
  customProps: {
    user: UserResponse["result"];
  };
}
interface AppContextProps {
  user?: UserResponse["result"];
  setUser: (user: UserResponse["result"]) => void;
}
const Context = createContext({} as AppContextProps);

interface ProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({
  children,
  customProps,
}: ProviderProps & Partial<CustomProps>) => {
  const [user, setUser] = useState(customProps?.user);

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useAppContext = () => useContext(Context);

export { useAppContext, AppProvider };
