import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { StateStorage, createJSONStorage, persist } from "zustand/middleware";

const asyncStorage: StateStorage = {
  getItem: (name: string): Promise<string | null> => {
    return AsyncStorage.getItem(name);
  },
  removeItem: (name: string): Promise<void> => {
    return AsyncStorage.removeItem(name);
  },
  setItem: (name: string, value: string): Promise<void> => {
    return AsyncStorage.setItem(name, value);
  },
};

/** Interface for an account */
export interface Account {
  /** The id of the account */
  id: string;
  /** The name on the account */
  name: string;
  /** The limit on the account */
  limit: number;
}

interface MainStore {
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  accounts: Account[];
  addAccount: (account: Account) => void;
  removeAccount: (id: string) => void;
  updateAccount: (id: string, account: Omit<Account, "id">) => void;
  getAccount: (id: string) => Account | undefined;
}

export const useMainStore = create<MainStore>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (hasHydrated: boolean) => {
        set({ _hasHydrated: hasHydrated });
      },
      accounts: [],
      addAccount: (account: Account) => {
        set(state => ({
          accounts: [...state.accounts, account],
        }));
      },
      removeAccount: (id: string) => {
        set(state => ({
          accounts: state.accounts.filter(account => account.id !== id),
        }));
      },
      updateAccount: (id: string, account: Omit<Account, "id">) => {
        const index = get().accounts.findIndex(account => account.id === id);
        if (index === -1) return;
        set(state => {
          const existing = state.accounts[index];
          return {
            accounts: [
              ...state.accounts.slice(0, index),
              { ...existing, ...account },
              ...state.accounts.slice(index + 1),
            ],
          };
        });
      },
      getAccount: (id: string) => {
        return get().accounts.find(account => account.id === id);
      },
    }),
    {
      name: "main-storage",
      storage: createJSONStorage(() => asyncStorage),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
