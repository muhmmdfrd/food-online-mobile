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
  isAuthenticated: boolean;
  user: User | null;
  authKey: string | null;
  code: string | null;
  login: (user: User, authKey: string, code: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const isAuthorized = await AuthHelper.isAuthorized();
      if (isAuthorized) {
        const token = await AuthHelper.getToken();
        setAuthKey(token);
        setIsAuthenticated(true);
        const storedUser = await AuthHelper.getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        }
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (user: User, authKey: string, code: string) => {
    try {
      setCode(code);
      setAuthKey(authKey);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error storing authKey:", error);
    }
  };

  const logout = async () => {
    try {
      await StorageHelper.removeAllData();
      setIsAuthenticated(false);
      setUser(null);
      setCode(null);
      setAuthKey(null);
    } catch (error) {
      console.error("Error removing authKey:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, authKey, code, login, logout }}
    >
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
