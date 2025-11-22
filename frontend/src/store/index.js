import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAppStore = create(
  persist(
    (set) => ({
      email: "",
      setEmail: (email) => set({ email }),
    }),
    {
      name: "user", // key in localStorage
    }
  )
);
