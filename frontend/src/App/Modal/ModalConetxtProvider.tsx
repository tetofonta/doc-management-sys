import React, { useCallback, useEffect, useState } from "react";
import { CbProps, DisplayModalProps, ModalContext } from "./modalContext";
import { DEFAULT_MODALS } from "../defaults/default_modals";
import { useApplicationModals } from "../../Plugins/modals";

const hist: DisplayModalProps<CbProps>[] = [];

export const ModalContextProvider = (props: { children: React.ReactElement | React.ReactElement[] }) => {
    const modals = useApplicationModals();
    const [p, setProps] = useState<DisplayModalProps<CbProps> | null>(null);

    const close = useCallback(
        (args: CbProps) => {
            let ret: boolean | undefined = false;
            const pp = { ...p };
            if (p?.cb) ret = p.cb(args);
            if (!ret) setProps(hist.pop() || null);
            else hist.push(pp as DisplayModalProps<CbProps>);
        },
        [p],
    );

    const display = useCallback(
        (props: DisplayModalProps<CbProps>) => {
            if (!modals || !modals[props.kind]) {
                console.error("No modal fount with the kind set to", props.kind);
                return false;
            }
            setProps(props);
            return true;
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
                    show: p?.kind === k,
                    props: p || {},
                    close,
                }),
            )}
        </ModalContext.Provider>
    );
};
