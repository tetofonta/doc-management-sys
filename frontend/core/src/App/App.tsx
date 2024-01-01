import { Admin, CustomRoutes } from "react-admin";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { loadRemoteComponents, RemoteComponentsContext, RemoteComponentsManifest } from "./Remote/remoteComponentsContext";
import { ApplicationAuthProvider } from "../providers/auth/authProvider";
import LoginPage from "./Login/LoginPage";
import AuthenticatedResource from "./AuthenticatedResource/AuthenticatedResource";
import React from "react";
import { Route } from "react-router-dom";
import { ApplicationDataProvider } from '../providers/data/dataProvider';

export const App = () => {
    /* prepare remote components context */
    const [remoteComponentsManifest, setRemoteComponentsManifest] = useState<RemoteComponentsManifest | undefined>(undefined);

    useEffect(() => {
        loadRemoteComponents((v) => setRemoteComponentsManifest(v));
    }, []);

    const About = React.lazy(() => import("./About/About"));

    return (
        <RemoteComponentsContext.Provider value={remoteComponentsManifest as RemoteComponentsManifest}>
            {!remoteComponentsManifest && <CircularProgress />}
            {remoteComponentsManifest && (
                <Admin
                    dataProvider={new ApplicationDataProvider("/api")}
                    authProvider={ApplicationAuthProvider.getInstance()}
                    loginPage={LoginPage}
                    requireAuth
                >
                    {/* Load our collections */}
                    {/* Todo: load files or tags??? */}

                    {/* Load additional collections from remote component*/}

                    {/* Load custom routes */}
                    <CustomRoutes>
                        <Route path={"/about"} element={<About />} />
                    </CustomRoutes>
                </Admin>
            )}
        </RemoteComponentsContext.Provider>
    );
};
