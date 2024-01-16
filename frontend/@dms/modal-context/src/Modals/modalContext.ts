import { createContext } from "react";

export const ModalContext = createContext({
    display: (modal_type: string, props: any, cb: (...args) => void) => {},
});

export const useModalConetx
