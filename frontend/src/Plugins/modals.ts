/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext, useContext } from "react";
import { ModalDescriptor } from "../App/Modal/modalContext";
import { DEFAULT_MODALS } from "../App/defaults/default_modals";

export const ModalContext = createContext({
    ...DEFAULT_MODALS,
} as ModalDescriptor<any, any>);

export const useApplicationModals = () => useContext(ModalContext);
