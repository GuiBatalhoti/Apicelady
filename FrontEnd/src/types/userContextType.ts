import { User } from "firebase/auth";
import { ReactNode } from "react";

export interface UserContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

export interface UserProviderProps {
    children: ReactNode;
  }