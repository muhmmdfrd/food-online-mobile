import React, {
  createContext,
  useState,
  useContext,
  FC,
  useEffect,
} from "react";
import { AuthHelper, StorageHelper } from "@/helpers";
import { User } from "@/models/user";

interface AuthContextType {
  authorized: boolean;
  user: User | null;
  code: string | null;
  login: (user: User, authKey: string, code: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const isAuthorized = await AuthHelper.isAuthorized();
      const usr = await AuthHelper.getCurrentUser();
      const c = await AuthHelper.getCode();
      setAuthorized(isAuthorized);
      setUser(usr);
      setCode(c);
    };
    checkAuthStatus();
  }, []);

  const login = async (user: User, authKey: string, code: string) => {
    try {
      await AuthHelper.setToken(authKey);
      await AuthHelper.setCode(code);
      await AuthHelper.setCurrentUser(user);
      setAuthorized(true);
      setUser(user);
      setCode(code);
    } catch (error) {
      console.error("Error storing authKey:", error);
    }
  };

  const logout = async () => {
    try {
      await StorageHelper.removeAllData();
      setUser(null);
      setCode(null);
      setAuthorized(false);
    } catch (error) {
      console.error("Error removing authKey:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ authorized, user, code, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
