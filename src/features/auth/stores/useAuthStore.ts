// store/authSlice.ts
import { create } from 'zustand';

export type AuthStore = {
  user: any | null;
  companyId: string | null;
  actions: {
    setUser: (user: any) => void;
    setCompanyId: (companyId: string) => void;
  };
};

export const useAuthStore = create<AuthStore>()(() => ({
  user: null,
  companyId: null,
  actions: {
    setUser: user => {
      return { user };
    },
    setCompanyId: companyId => {
      return { companyId };
    },
  },
}));
