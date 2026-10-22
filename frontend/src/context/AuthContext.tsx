'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ArtisanProfile, UserRole } from '@/lib/types';
import { api } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  artisanProfile: ArtisanProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isArtisan: boolean;
  isAdmin: boolean;
  isBuyer: boolean;
  login: (email: string) => Promise<void>;
  demoLogin: (role: UserRole, id?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [artisanProfile, setArtisanProfile] = useState<ArtisanProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage or auto-load Sunita Devi (artisan) as default demo account
  useEffect(() => {
    async function initAuth() {
      const savedToken = localStorage.getItem('kv_token');
      if (savedToken) {
        try {
          const res = await api.getMe();
          setUser(res.user);
          if (res.artisanProfile) setArtisanProfile(res.artisanProfile);
        } catch {
          // If expired, clear storage
          localStorage.removeItem('kv_token');
          localStorage.removeItem('kv_demo_user_id');
        }
      } else {
        // By default for demo ease, automatically log in as Master Artisan Sunita Devi
        try {
          const res = await api.demoLogin('artisan');
          localStorage.setItem('kv_token', res.token);
          localStorage.setItem('kv_demo_user_id', res.user.id);
          setUser(res.user);
          if (res.artisanProfile) setArtisanProfile(res.artisanProfile);
        } catch (e) {
          console.warn('Could not auto-login demo account:', e);
        }
      }
      setIsLoading(false);
    }
    initAuth();
  }, []);

  const demoLogin = async (role: UserRole, id?: string) => {
    setIsLoading(true);
    try {
      const res = await api.demoLogin(role, id);
      localStorage.setItem('kv_token', res.token);
      localStorage.setItem('kv_demo_user_id', res.user.id);
      setUser(res.user);
      setArtisanProfile(res.artisanProfile || null);
    } catch (err: any) {
      alert('Demo login failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email);
      localStorage.setItem('kv_token', res.token);
      localStorage.setItem('kv_demo_user_id', res.user.id);
      setUser(res.user);
      setArtisanProfile(res.artisanProfile || null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('kv_token');
    localStorage.removeItem('kv_demo_user_id');
    setUser(null);
    setArtisanProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        artisanProfile,
        isLoading,
        isAuthenticated: !!user,
        isArtisan: user?.role === 'artisan',
        isAdmin: user?.role === 'admin',
        isBuyer: user?.role === 'buyer',
        login,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
