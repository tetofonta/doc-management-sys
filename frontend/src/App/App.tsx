import React, { Suspense } from "react";
import { Admin, CustomRoutes, ListGuesser, Resource } from "react-admin";
import { Route } from "react-router-dom";
import { ModalContextProvider } from "./Modal/ModalConetxtProvider";
import jsonServerProvider from "ra-data-json-server";
import ApplicationLayout from "./Layout/ApplicationLayout";
import { useApplicationCustomRoutes } from "../Plugins/routes";
import { ApplicationAuthProvider } from "../providers/auth/authProvider";
import { CircularProgress } from "@mui/material";
import { usePluginResources } from "../Plugins/resources";
import AuthenticatedResource from "./Resources/AuthenticatedResource/AuthenticatedResource";
import { ApplicationDataProvider } from "../providers/data/dataProvider";
import UserList from "../Plugins/BasicAuth/Resources/Users/List";

export const App = () => {
    const LoginPage = React.lazy(() => import("./Login/LoginPage"));

    const custom_routes = useApplicationCustomRoutes();
    const resources = usePluginResources();

    return (
        <ModalContextProvider>
            <Admin
                layout={ApplicationLayout}
                dataProvider={new ApplicationDataProvider("/api")}
                authProvider={ApplicationAuthProvider.getInstance()}
                loginPage={LoginPage}
                requireAuth
            >
                {resources.map((e, i) => (
                    <AuthenticatedResource key={i} {...e} />
                ))}

                {/* Load custom routes */}
                <CustomRoutes>
                    {custom_routes.map((e) => (
                        <Route
                            key={e.route}
                            path={e.route}
                            element={<Suspense fallback={<CircularProgress />}>{React.createElement(e.element, {})}</Suspense>}
                        />
                    ))}
                </CustomRoutes>
            </Admin>
        </ModalContextProvider>
    );
};
