/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ModalContext } from './modalContext';

export type ModalType = {
    name: string;
    element: React.ReactElement;
    show: (props: any, cb: (...args: any) => void) => void;
};

export const ModalContextProvider = (props: { children: React.ReactElement; modals: ModalType[] }) => {
    return (
        <ModalContext.Provider
            value={{
                display: (type: string, p: any, cb: (...args: any) => void) => {
                    const desc = props.modals.find((e) => e.name == type);
                    if (desc) desc.show(p, cb);
                },
            }}
        >
            {props.children}
            {props.modals.map((e) => e.element)}
        </ModalContext.Provider>
    );
};
