/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext } from "react";

export interface CbProps {}

export interface DisplayModalProps<T> {
    kind: string;
    cb?: (args: T) => void;
}

export interface ModalProps<T, V extends DisplayModalProps<T>> {
    show: boolean;
    close: (args: T) => void;
    props: Omit<V, "kind" | "cb">;
}

export type ModalDescriptor<T, V extends DisplayModalProps<T>> = {
    [k: string]: React.FunctionComponent<ModalProps<T, V>> | React.ExoticComponent<ModalProps<T, V>>;
};

export const ModalContext = createContext({
    display: (_props: DisplayModalProps<any>) => {},
    exists: (_key: string): boolean => false,
});

export const useModalContext = () => useContext(ModalContext);
