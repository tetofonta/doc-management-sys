import React from "react";
import { Admin, CustomRoutes, Loading } from "react-admin";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { loadRemoteComponents, RemoteComponentsContext, RemoteComponentsManifest } from "./Remote/remoteComponentsContext";
import { Route } from "react-router-dom";
import RemoteResource from "./Resources/RemoteResource/RemoteResource";
import RemoteRaComponent from "./Remote/RemoteRaComponent";
import { ApplicationDataProvider } from "../providers/data/dataProvider";
import { ApplicationAuthProvider } from "../providers/auth/authProvider";
import ApplicationLayout from "./Layout/ApplicationLayout";
import { ModalProvider } from "./Modal/ModalProvider";

export const App = () => {
    /* prepare remote components context */
    const [remoteComponentsManifest, setRemoteComponentsManifest] = useState<RemoteComponentsManifest | undefined>(undefined);

    useEffect(() => {
        loadRemoteComponents((v) => setRemoteComponentsManifest(v));
    }, []);

    const LoginPage = React.lazy(() => import("./Login/LoginPage"));
    const About = React.lazy(() => import("./About/About"));

    return (
        <RemoteComponentsContext.Provider value={remoteComponentsManifest as RemoteComponentsManifest}>
            {!remoteComponentsManifest && <CircularProgress />}
            {remoteComponentsManifest && (
                <ModalProvider>
                    <Admin
                        dataProvider={new ApplicationDataProvider("/api")}
                        authProvider={ApplicationAuthProvider.getInstance()}
                        loginPage={LoginPage}
                        layout={ApplicationLayout}
                        requireAuth
                    >
                        {/* Load our collections */}

                        {/* Load additional collections from remote component*/}
                        <RemoteResource
                            name={"local-users"}
                            options={{ label: "Local Users" }}
                            list={() => <RemoteRaComponent component_id="auth-basic-user-list" load={<Loading />} />}
                            show={() => <RemoteRaComponent component_id="auth-basic-user-detail" load={<Loading />} />}
                            create={() => (
                                <RemoteRaComponent component_id="auth-basic-user-form" create={true} load={<Loading />} />
                            )}
                            edit={() => <RemoteRaComponent component_id="auth-basic-user-form" load={<Loading />} />}
                        />

                        <RemoteResource
                            name={"local-groups"}
                            options={{ label: "Local Groups" }}
                            list={() => <RemoteRaComponent component_id="auth-basic-group-list" load={<Loading />} />}
                            show={() => <RemoteRaComponent component_id="auth-basic-group-detail" load={<Loading />} />}
                        />

                        {/* Load custom routes */}
                        <CustomRoutes>
                            <Route path={"/about"} element={<About />} />
                        </CustomRoutes>
                    </Admin>
                </ModalProvider>
            )}
        </RemoteComponentsContext.Provider>
    );
};
