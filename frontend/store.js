import create from 'zustand';

const getInitialState = () => {
  if (typeof window !== 'undefined') {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    return {
      userId: userId ? JSON.parse(userId) : null,
      token: token ? JSON.parse(token) : null,
    };
  }
  return { userId: null, token: null };
};

const useAuthStore = create((set) => ({
  ...getInitialState(),
  setUserId: (userId) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userId', JSON.stringify(userId));
    }
    set({ userId });
  },
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', JSON.stringify(token));
    }
    set({ token });
  },
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
    }
    set({ userId: null, token: null });
  },
}));

export default useAuthStore;
