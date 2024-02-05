// 1. Create a context

import { createContext, useContext, useState } from "react";
import { executeBasicAuthenticationService, executeJWTAuthenticationService } from "../api/AuthenticationApiService";
import { apiClient } from "../api/ApiClient";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);


// 2: SHare the created context with other components

export default function AuthProvider({ children }) {
    
    // 3: Put sime state in the context
    const [isAuthenticated, setAuthenticated] = useState(false)

    const [username, setUsername] = useState(null)

    const [token, setToken] = useState(null);

    // function login(username, password) {
    //     if(username === 'Akash' && password == 'sky') {
    //         setAuthenticated(true);
    //         setUsername(username);
    //         return true;
    //      } else {
    //         setAuthenticated(false);
    //         setUsername(null);
    //         return false;
    //      }
    // }

    // async function login(username, password) {
    //     const basicAuthenicationToken = 'Basic ' + window.btoa(username + ":" + password);

    //     try {
    //         console.log('sdsfgfg')
    //         const response = await executeBasicAuthenticationService(basicAuthenicationToken);

    //         if(response.status == 200) {
    //             setAuthenticated(true);
    //             setUsername(username);
    //             setToken(basicAuthenicationToken);

    //             apiClient.interceptors.request.use(
    //                 (config) => {
    //                     console.log('intercepting and add a token')
    //                     config.headers.Authorization=basicAuthenicationToken;
    //                     return config
    //                 }
    //             );
    //             return true;
    //          } else {
    //             logout();
    //             return false;
    //          }
    //     } catch(error) {
    //         logout();
    //         return false;
    //     }
    // }

    async function login(username, password) {
        const basicAuthenicationToken = 'Basic ' + window.btoa(username + ":" + password);

        try {
            const response = await executeJWTAuthenticationService(username, password);

            if(response.status == 200) {
                const jwtToken = 'Bearer ' + response.data.token;
                setAuthenticated(true);
                setUsername(username);
                setToken(jwtToken);

                apiClient.interceptors.request.use(
                    (config) => {
                        console.log('intercepting and add a token')
                        config.headers.Authorization=jwtToken;
                        return config
                    }
                );
                return true;
             } else {
                logout();
                return false;
             }
        } catch(error) {
            logout();
            return false;
        }
    }


    function logout() {
        setAuthenticated(false);
        setToken(null);
        setUsername(null);
    }

    return (
        <AuthContext.Provider value={ {isAuthenticated, login, logout, username, token } }>
            {children}
        </AuthContext.Provider>
    )
}