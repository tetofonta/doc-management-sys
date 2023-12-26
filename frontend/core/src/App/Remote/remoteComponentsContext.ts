import { createContext, useContext } from "react";

export type RemoteComponentDescriptor = {
    index: string;
    integrity: string;
    [k: string]: any;
};

export type RemoteComponentsManifest = {
    [k: string]: RemoteComponentDescriptor;
};

export const RemoteComponentsContext = createContext<RemoteComponentsManifest>({});

export const useRemoteComponentsContext = () =>
    useContext(RemoteComponentsContext);

export const loadRemoteComponents = (
    notify: (msg: string, opt: any) => void,
    cb: (r: RemoteComponentsManifest) => void,
) => {
    fetch("/components/manifest.json")
        .then((r) => r.json())
        .then((r) => {
            console.log(`Loaded ${Object.keys(r).length} plugins`)
            cb(r)
        })
        .catch((e) => {
            console.error("Cannot load plugins because of error", e);
            notify(
                "Cannot load plugins from manifest. see console for additional information",
                {type: 'error'}
            );
            cb({});
        });
};
