import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (user: Omit<User, 'id'>) => Promise<User | null>;
  updateUser: (user: User) => Promise<User | null>;
  deleteUser: (userId: string) => Promise<boolean>;
  getAllUsers: () => Promise<User[]>;
  getUserById: (userId: string) => Promise<User | undefined>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  register: async () => null,
  updateUser: async () => null,
  deleteUser: async () => false,
  getAllUsers: async () => [],
  getUserById: async () => undefined,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = 'https://ajuda.sincsuite.com.br';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const storedUser = getStorageItem<User | null>('currentUser', null);
    if (storedUser) {
      setAuthState({
        user: storedUser,
        isAuthenticated: true,
      });
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ username, password }),
      });

      if (!res.ok) {
        console.error('Erro na autenticação:', res.status, await res.text());
        return false;
      }

      const data = await res.json();

      if (!data.access_token) {
        console.error('Token não recebido da API');
        return false;
      }

      const user: User = {
        id: data.user?.id ?? '',
        name: data.user?.name ?? '',
        email: data.user?.email ?? '',
        login: username,
        password: '',
        role: data.user?.role ?? 'user',
      };

      setAuthState({ user, isAuthenticated: true });
      setStorageItem('currentUser', user);
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  const logout = (): void => {
    setAuthState({ user: null, isAuthenticated: false });
    removeStorageItem('currentUser');
  };

  const register = async (userData: Omit<User, 'id'>): Promise<User | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          login: userData.login,
          password: userData.password,
          role: userData.role,
        }),
      });
      if (!res.ok) return null;

      const newUser = await res.json();
      return newUser;
    } catch (error) {
      console.error('Register error:', error);
      return null;
    }
  };

  const updateUser = async (updatedUser: User): Promise<User | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      if (!res.ok) return null;

      const user = await res.json();

      if (authState.user?.id === user.id) {
        setAuthState({ user, isAuthenticated: true });
        setStorageItem('currentUser', user);
      }
      return user;
    } catch (error) {
      console.error('Update user error:', error);
      return null;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
      });
      if (!res.ok) return false;

      if (authState.user?.id === userId) {
        logout();
      }
      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      return false;
    }
  };

  const getAllUsers = async (): Promise<User[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/users`);
      if (!res.ok) return [];

      const users = await res.json();
      return users;
    } catch (error) {
      console.error('Get all users error:', error);
      return [];
    }
  };

  const getUserById = async (userId: string): Promise<User | undefined> => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`);
      if (!res.ok) return undefined;

      const user = await res.json();
      return user;
    } catch (error) {
      console.error('Get user by id error:', error);
      return undefined;
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    register,
    updateUser,
    deleteUser,
    getAllUsers,
    getUserById,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};








