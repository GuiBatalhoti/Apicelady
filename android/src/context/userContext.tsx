import { User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { UserContextType, UserProviderProps } from "../types/userContextType";


const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
    }, []);

    const login = (user: User) => {
        setUser(user);
    }

    const logout = () => {
        setUser(null);
    }

    useEffect(() => {
        console.log(user);
    }, [user]);

    return (
        <UserContext.Provider value={{user, loading, login, logout}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}