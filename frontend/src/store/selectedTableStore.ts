import { create } from 'zustand'

type selectedTableStore = {
    selectedTable: string;
    setSelectedTable: (sT: string) => void;
};
export const useSelectedTableStore = create<selectedTableStore>()((set) => ({
    selectedTable: "",
    setSelectedTable: (sT) => set((state) => ({ selectedTable: sT })),
}));