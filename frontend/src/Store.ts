import { create } from 'zustand'

type selectedTableStore = {
    selectedTable: string;
    setSelectedTable: (sT: string) => void;
};
const useSelectedTableStore = create<selectedTableStore>()((set) => ({
    selectedTable: "",
    setSelectedTable: (sT) => set((state) => ({ selectedTable: sT })),
}));





export { useSelectedTableStore };