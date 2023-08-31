import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);


    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('token');
            const ID = localStorage.getItem('userId');
            if (!token) {
                setIsUserLoggedIn(false);
                setIsAuthenticating(false);
                return;
            }

            try {
                const response = await axios.get(`/api/server/auth-check/${ID}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setIsUserLoggedIn(response.status === 200);
            } catch (error) {
                setIsUserLoggedIn(false);
            } finally {
                setIsAuthenticating(false);
            }
        };

        checkAuthStatus();
    }, []);

    const value = {
        isUserLoggedIn,
        isAuthenticating,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
