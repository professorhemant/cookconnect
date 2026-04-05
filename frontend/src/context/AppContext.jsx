import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('cookconnect_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [token, setToken] = useState(() => localStorage.getItem('cookconnect_token') || null);

  function saveUser(user, tok) {
    setCurrentUser(user);
    setToken(tok);
    localStorage.setItem('cookconnect_user', JSON.stringify(user));
    localStorage.setItem('cookconnect_token', tok);
  }

  function clearUser() {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('cookconnect_user');
    localStorage.removeItem('cookconnect_token');
  }

  return (
    <AppContext.Provider value={{ currentUser, token, saveUser, clearUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
