/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModalDescriptor } from "../Modal/modalContext";
import React from "react";

export const DEFAULT_MODALS: ModalDescriptor<any, any> = {
    message: React.lazy(() => import("../Modal/Modals/MessageModal")),
    yesno: React.lazy(() => import("../Modal/Modals/YesNoModal")),
    yesnoabort: React.lazy(() => import("../Modal/Modals/YesNoAbortModal")),
    form: React.lazy(() => import("../Modal/Modals/FormModal")),
};
