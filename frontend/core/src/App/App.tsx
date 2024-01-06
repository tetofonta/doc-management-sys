import { Admin, CustomRoutes, EditGuesser, ListGuesser, Loading } from "react-admin";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { loadRemoteComponents, RemoteComponentsContext, RemoteComponentsManifest } from "./Remote/remoteComponentsContext";
import { ApplicationAuthProvider } from "../providers/auth/authProvider";
import { QueryClientProvider, QueryClient } from "react-query";
import LoginPage from "./Login/LoginPage";
import React from "react";
import { Route } from "react-router-dom";
import ApplicationLayout from "./Layout/ApplicationLayout";
import jsonServerProvider from "ra-data-json-server";
import RemoteResource from "./Resources/RemoteResource/RemoteResource";
import RemoteRaComponent from "./Remote/RemoteRaComponent";

export const App = () => {
    /* prepare remote components context */
    const [remoteComponentsManifest, setRemoteComponentsManifest] = useState<RemoteComponentsManifest | undefined>(undefined);

    useEffect(() => {
        loadRemoteComponents((v) => setRemoteComponentsManifest(v));
    }, []);

    const About = React.lazy(() => import("./About/About"));
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient} contextSharing={true}>
            <RemoteComponentsContext.Provider value={remoteComponentsManifest as RemoteComponentsManifest}>
                {!remoteComponentsManifest && <CircularProgress />}
                {remoteComponentsManifest && (
                    <Admin
                        // dataProvider={new ApplicationDataProvider("/api")}
                        dataProvider={jsonServerProvider("https://jsonplaceholder.typicode.com")}
                        authProvider={ApplicationAuthProvider.getInstance()}
                        loginPage={LoginPage}
                        layout={ApplicationLayout}
                        queryClient={queryClient}
                        requireAuth
                    >
                        {/* Load our collections */}
                        <RemoteResource
                            name={"users"}
                            list={() => <RemoteRaComponent component_id="auth-basic-user-list" load={<Loading />} />}
                            // list={ListGuesser}
                            edit={EditGuesser}
                        />

                        {/* Load additional collections from remote component*/}

                        {/* Load custom routes */}
                        <CustomRoutes>
                            <Route path={"/about"} element={<About />} />
                        </CustomRoutes>
                    </Admin>
                )}
            </RemoteComponentsContext.Provider>
        </QueryClientProvider>
    );
};
