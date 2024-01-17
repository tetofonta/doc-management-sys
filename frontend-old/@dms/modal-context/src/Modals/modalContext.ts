import { createContext, useContext } from 'react';

export const ModalContext = createContext({
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
    display: (modal_type: string, props?: any, cb?: (...args: any[]) => void) => {},
});

export const useModalContext = () => useContext(ModalContext);
