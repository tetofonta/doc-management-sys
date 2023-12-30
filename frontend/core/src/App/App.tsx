import { Admin, ListGuesser, Resource } from "react-admin";
import { CircularProgress } from "@mui/material";
import { dataProvider } from "../providers/dataProvider";
import { useEffect, useState } from "react";
import { loadRemoteComponents, RemoteComponentsContext, RemoteComponentsManifest } from "./Remote/remoteComponentsContext";
import { ApplicationAuthProvider } from "../providers/authProvider";
import LoginPage from "./Login/LoginPage";
import AuthenticatedResource from "./AuthenticatedResource/AuthenticatedResource";

export const App = () => {
    /* prepare remote components context */
    const [remoteComponentsManifest, setRemoteComponentsManifest] = useState<RemoteComponentsManifest | undefined>(undefined);

    useEffect(() => {
        loadRemoteComponents((v) => setRemoteComponentsManifest(v));
    }, []);

    return (
        <RemoteComponentsContext.Provider value={remoteComponentsManifest as RemoteComponentsManifest}>
            {!remoteComponentsManifest && <CircularProgress />}
            {remoteComponentsManifest && (
                <Admin dataProvider={dataProvider} authProvider={new ApplicationAuthProvider()} loginPage={LoginPage} requireAuth>
                    {/* Load our collections */}
                    {/* Todo: load files or tags??? */}

                    {/* Load additional collections */}
                    <AuthenticatedResource name={"users"} list={ListGuesser} requiredFeatures={["not:existing"]} />
                    <AuthenticatedResource name={"posts"} list={ListGuesser} requiredFeatures={["token:info"]} />

                    {/* Load custom routes */}
                </Admin>
            )}
        </RemoteComponentsContext.Provider>
    );
};
