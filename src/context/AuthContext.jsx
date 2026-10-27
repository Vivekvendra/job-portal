import React, { createContext, useContext, useState } from 'react';
import { STORAGE_KEYS, getFromStorage, saveToStorage, removeFromStorage } from '../utils/localStorage';
import { INITIAL_USERS } from '../utils/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    let storedUsers = getFromStorage(STORAGE_KEYS.ALL_USERS, null);
    if (!storedUsers || storedUsers.length === 0) {
      storedUsers = INITIAL_USERS;
      saveToStorage(STORAGE_KEYS.ALL_USERS, INITIAL_USERS);
    }
    return storedUsers;
  });

  const [user, setUser] = useState(() => {
    return getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
  });

  const [isLoading, setIsLoading] = useState(false);

  // Login handler
  const login = async (email, password, rememberMe = true, roleOverride = null) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const existingUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (existingUser) {
      const activeUser = {
        ...existingUser,
        role: roleOverride || existingUser.role,
        lastLogin: new Date().toISOString(),
      };
      setUser(activeUser);
      if (rememberMe) {
        saveToStorage(STORAGE_KEYS.CURRENT_USER, activeUser);
      }
      setIsLoading(false);
      return { success: true, user: activeUser };
    }

    const emailExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    setIsLoading(false);
    if (emailExists) {
      return { success: false, message: 'Invalid password. Please check your credentials.' };
    }
    return { success: false, message: 'No account found with this email. Please sign up.' };
  };

  // Quick Demo Login for convenient testing
  const demoLogin = (role = 'Candidate') => {
    const demoUser = users.find((u) => u.role === role) || users[0];
    setUser(demoUser);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, demoUser);
    return demoUser;
  };

  // Register handler
  const register = async (userData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const emailExists = users.some(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase()
    );

    if (emailExists) {
      setIsLoading(false);
      return { success: false, message: 'An account with this email already exists!' };
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'Candidate',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
      createdAt: new Date().toISOString(),
      company: userData.company || (userData.role === 'Recruiter' ? 'My Enterprise Inc' : ''),
      title: userData.title || (userData.role === 'Candidate' ? 'Job Seeker' : 'Hiring Manager'),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveToStorage(STORAGE_KEYS.ALL_USERS, updatedUsers);

    setUser(newUser);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, newUser);
    setIsLoading(false);
    return { success: true, user: newUser };
  };

  // Forgot password handler
  const forgotPassword = async (email) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const userMatch = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    setIsLoading(false);
    if (!userMatch) {
      return {
        success: false,
        message: 'No registered user found with this email address.',
      };
    }
    return {
      success: true,
      message: `Password reset link sent to ${email}. Check your inbox!`,
    };
  };

  // Reset password
  const resetPassword = async (email, newPassword) => {
    const updatedUsers = users.map((u) =>
      u.email.toLowerCase() === email.toLowerCase() ? { ...u, password: newPassword } : u
    );
    setUsers(updatedUsers);
    saveToStorage(STORAGE_KEYS.ALL_USERS, updatedUsers);
    if (user && user.email.toLowerCase() === email.toLowerCase()) {
      const updatedCurr = { ...user, password: newPassword };
      setUser(updatedCurr);
      saveToStorage(STORAGE_KEYS.CURRENT_USER, updatedCurr);
    }
    return { success: true, message: 'Password has been updated successfully.' };
  };

  // Switch role on the fly
  const switchRole = (newRole) => {
    if (!user) return;
    const updatedUser = { ...user, role: newRole };
    setUser(updatedUser);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, updatedUser);

    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
    setUsers(updatedUsers);
    saveToStorage(STORAGE_KEYS.ALL_USERS, updatedUsers);
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    removeFromStorage(STORAGE_KEYS.CURRENT_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        isAuthenticated: !!user,
        isLoading,
        login,
        demoLogin,
        register,
        forgotPassword,
        resetPassword,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
