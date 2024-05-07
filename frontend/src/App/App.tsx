import React, { Suspense } from "react";
import { AdminContext, AdminUI, CustomRoutes, defaultI18nProvider, ShowGuesser } from "react-admin";
import { Route } from "react-router-dom";
import { ModalContextProvider } from "./Modal/ModalConetxtProvider";
import ApplicationLayout from "./Layout/ApplicationLayout";
import { useApplicationCustomRoutes } from "../Plugins/routes";
import { ApplicationAuthProvider } from "../providers/auth/authProvider";
import { CircularProgress } from "@mui/material";
import { Search } from "@mui/icons-material";
import { usePluginResources } from "../Plugins/resources";
import AuthenticatedResource from "./Resources/AuthenticatedResource/AuthenticatedResource";
import { ApplicationDataProvider } from "../providers/data/dataProvider";
import { FileList } from "./Explorer/List/FileList";
import { ResourcesFacetsType, useFacetContext } from './FacetProvider/facetContext';
import { FileSearch } from './Explorer/List/Search';

export const App = () => {
    const LoginPage = React.lazy(() => import("./Login/LoginPage"));

    const custom_routes = useApplicationCustomRoutes();
    const resources = usePluginResources();
    const facet_provider = useFacetContext();

    return (
        <AdminContext
            dataProvider={new ApplicationDataProvider("/api", undefined, (res: string, data: ResourcesFacetsType) => facet_provider.setFacets(res, data))}
            authProvider={ApplicationAuthProvider.getInstance()}
            i18nProvider={defaultI18nProvider}
        >
            <ModalContextProvider>
                <AdminUI layout={ApplicationLayout} loginPage={LoginPage} requireAuth>
                    <AuthenticatedResource
                        name={"files"}
                        options={{ label: "Explorer" }}
                        list={FileList}
                        requiredListFeatures={["documents:list"]}
                    />
                    <AuthenticatedResource
                        name={"files/search"}
                        options={{ label: "Search" }}
                        list={FileSearch}
                        requiredListFeatures={["documents:search"]}
                        icon={Search}
                    />
                    {resources.map((e, i) => (
                        <AuthenticatedResource key={i} {...e} />
                    ))}

                    {/* Load custom routes */}
                    <CustomRoutes>
                        {custom_routes.map((e) => (
                            <Route
                                key={e.route}
                                path={e.route}
                                element={
                                    <Suspense fallback={<CircularProgress />}>{React.createElement(e.element, {})}</Suspense>
                                }
                            />
                        ))}
                    </CustomRoutes>
                </AdminUI>
            </ModalContextProvider>
        </AdminContext>
    );
};
