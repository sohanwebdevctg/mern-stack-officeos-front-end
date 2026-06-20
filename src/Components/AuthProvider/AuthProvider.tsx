import { createContext, useState, type ReactNode, type Dispatch,type SetStateAction} from "react";
import { getUser, type LoginResponse } from "../../utilities/localstorage";

// The type of data that will be contained within the context is set
interface AuthContextType {
  validUser: LoginResponse | null;
  setValidUser: Dispatch<SetStateAction<LoginResponse | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

// Initially, the value of the context may be null, so the type is set.
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {

  // state is set with user data from local storage
  const [validUser, setValidUser] = useState<LoginResponse | null>(() => getUser());

  // set loading state
  const [loading, setLoading] = useState<boolean>(true);

  // sharing the context value
  const userInfo = {validUser, setValidUser, loading,setLoading};

  return (
    <AuthContext.Provider value={userInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthProvider, AuthContext};