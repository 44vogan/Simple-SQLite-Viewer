import { create } from 'zustand'

type selectedTableStore = {
    selectedTable: string;
    setSelectedTable: (sT: string) => void;
};
const useSelectedTableStore = create<selectedTableStore>()((set) => ({
    selectedTable: "",
    setSelectedTable: (sT) => set((state) => ({ selectedTable: sT })),
}));

type globalRowLimit = {
    globalRowLimit: number;
    setGlobalRowLimit: (n: number) => void;
};
const useglobalRowLimit = create<globalRowLimit>()((set) => ({
    globalRowLimit: 10,
    setGlobalRowLimit: (n) => set((state) => ({ globalRowLimit: n })),
}));

type globalShowQueryExec = {
    globalShowQueryExec: boolean;
    setGlobalShowQueryExec: (b: boolean) => void;
};
const useGlobalShowQueryExec = create<globalShowQueryExec>()((set) => ({
    globalShowQueryExec: false,
    setGlobalShowQueryExec: (b) => set((state) => ({ globalShowQueryExec: b })),
}));




export { useSelectedTableStore, useglobalRowLimit, useGlobalShowQueryExec };