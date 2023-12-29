import { RemoteComponentDescriptor } from "@dms/remote-component";
import { createContext, useContext } from "react";

export type RemoteComponentsManifest = {
    [k: string]: RemoteComponentDescriptor;
};

export const RemoteComponentsContext = createContext<RemoteComponentsManifest>({});

export const useRemoteComponentsContext = () => useContext(RemoteComponentsContext);

export const loadRemoteComponents = (cb: (r: RemoteComponentsManifest) => void) => {
    fetch("/components/manifest.json")
        .then((r) => r.json())
        .then((r) => {
            console.log(`Loaded ${Object.keys(r).length} plugins`);
            cb(r);
        })
        .catch((e) => {
            console.error("Cannot load plugins because of error", e);
            cb({});
        });
};
