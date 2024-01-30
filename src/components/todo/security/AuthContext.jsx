// 1. Create a context

import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);


// 2: SHare the created context with other components

export default function AuthProvider({ children }) {
    
    // 3: Put sime state in the context
    const [isAuthenticated, setAuthenticated] = useState(false)

    const [username, setUsername] = useState(null)

    function login(username, password) {
        if(username === 'Akash' && password == 'sky') {
            setAuthenticated(true);
            setUsername(username);
            return true;
         } else {
            setAuthenticated(false);
            setUsername(null);
            return false;
         }
    }

    function logout() {
        setAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={ {isAuthenticated, login, logout, username } }>
            {children}
        </AuthContext.Provider>
    )
}