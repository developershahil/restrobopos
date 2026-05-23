// Simple Auth utilities
export const SESSION_KEY = 'rb_session_token';

export const setSession = () => {
  const token = `rb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  sessionStorage.setItem(SESSION_KEY, token);
  localStorage.setItem('isLoggedIn', 'true');
};

export const clearSession = () => {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('isLoggedIn');
};
