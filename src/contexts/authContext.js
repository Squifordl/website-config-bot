import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [authError, setAuthError] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get(`/api/server/auth-check/${userId}`, {
                    withCredentials: true
                });
                setIsUserLoggedIn(response.status === 200);
            } catch (error) {
                setIsUserLoggedIn(false);
                setAuthError('Falha na autenticação. Tente novamente.');
            } finally {
                setIsAuthenticating(false);
            }
        };

        checkAuthStatus();
    }, [userId, setIsUserLoggedIn, setIsAuthenticating]);

    const value = {
        isUserLoggedIn,
        isAuthenticating,
        authError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}