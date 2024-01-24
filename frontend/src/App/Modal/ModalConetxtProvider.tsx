import React, { useCallback, useState } from "react";
import { CbProps, DisplayModalProps, ModalContext } from "./modalContext";
import { DEFAULT_MODALS } from "../defaults/default_modals";
import { useApplicationModals } from "../../Plugins/modals";

export const ModalContextProvider = (props: { children: React.ReactElement | React.ReactElement[] }) => {
    const modals = useApplicationModals();
    const [type, setType] = useState("");
    const [cb, setCb] = useState<undefined | ((args: CbProps) => void)>(undefined);
    const [p, setProps] = useState<object>({});

    const close = useCallback(
        (args: CbProps) => {
            setType("");
            if (cb) cb(args);
        },
        [cb],
    );

    const display = useCallback(
        (props: DisplayModalProps<CbProps>) => {
            if (!modals || !modals[props.kind]) {
                console.error("No modal fount with the kind set to", props.kind);
                return;
            }

            setCb((_old: undefined | ((args: CbProps) => void)) => props.cb);
            setProps(props);
            setType(props.kind);
        },
        [modals],
    );

    const exists = useCallback(
        (key: string) => {
            return modals && !!modals[key];
        },
        [modals],
    );

    return (
        <ModalContext.Provider
            value={{
                display,
                exists,
            }}
        >
            {props.children}

            {...Object.keys(modals).map((k) =>
                React.createElement(modals[k], {
                    show: type === k,
                    props: p,
                    close,
                }),
            )}
        </ModalContext.Provider>
    );
};
