import { createContext, useContext } from "react";

export interface DirectoryDescriptor {
    id: string;
    name: string;
    group: string;
    owner: string;
    group_permissions: string[];
    guest_permissions: string[];
}

export interface CurrentDirectory {
    path: DirectoryDescriptor[];
    current?: DirectoryDescriptor;
    pop: () => void;
    push: (id: string) => Promise<void>;
    navigate: (index: number) => void;
    canCreate: () => boolean;
    canUpload: () => boolean;
    canEdit: () => boolean;
}

export const DirectoryContext = createContext<CurrentDirectory>({
    path: [],
    pop: () => {},
    push: async () => {},
    navigate: () => {},
    canCreate: () => false,
    canUpload: () => false,
    canEdit: () => false,
});

export const useDirectoryContext = () => useContext(DirectoryContext);
