import React, { useCallback, useState } from "react";
import { ModalContextProvider } from "@dms/modal-context";
import { MessageModal } from "./Modals/MessageModal";
import { YesNoModal } from "./Modals/YesNoModal";

export const ModalProvider = (props: { children: React.ReactElement }) => {
    const [type, setType] = useState("");
    const [cb, setCb] = useState<null | ((...args: any) => void)>(null);
    const [p, setProps] = useState<any>({});

    const close = useCallback(
        (...args: any[]) => {
            if (cb) cb(...args);
            setType("");
        },
        [cb],
    );

    const show = (type: string) => (p?: any, cb?: (...args: any) => void) => {
        setCb(() => cb);
        setProps(p);
        setType(type);
    };

    const makeModal = (name: string, Element: React.FunctionComponent<any>) => ({
        name,
        element: <Element show={type == name} data={p} close={close} />,
        show: show(name),
    });

    return (
        <ModalContextProvider modals={[makeModal("message", MessageModal), makeModal("yesno", YesNoModal)]}>
            {props.children}
        </ModalContextProvider>
    );
};
