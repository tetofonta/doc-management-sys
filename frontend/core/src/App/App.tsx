import { Admin, ListGuesser, Resource, useNotify } from "react-admin";
import { CircularProgress } from "@mui/material";
import { dataProvider } from "../providers/dataProvider";
import { useEffect, useState } from "react";
import {
    loadRemoteComponents,
    RemoteComponentsContext,
    RemoteComponentsManifest,
} from "./Remote/remoteComponentsContext";
import { RemoteComponent } from "./Remote/RemoteComponent";

export const App = () => {
    const notify = useNotify();

    /* prepare remote components context */
    const [remoteComponentsManifest, setRemoteComponentsManifest] = useState<
        RemoteComponentsManifest | undefined
    >(undefined);

    useEffect(() => {
        loadRemoteComponents(notify, (v) => setRemoteComponentsManifest(v));
    }, []);

    if (!remoteComponentsManifest) return <CircularProgress />;

    return (
        <RemoteComponentsContext.Provider value={remoteComponentsManifest}>
            <Admin dataProvider={dataProvider}>
                <Resource
                    name="posts"
                    list={ListGuesser}
                    show={() => (
                        <RemoteComponent
                            component_id={"test-remote-component"}
                            content={"aaaa"}
                        />
                    )}
                />
            </Admin>
        </RemoteComponentsContext.Provider>
    );
};
