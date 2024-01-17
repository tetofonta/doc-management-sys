import React from "react";
import { Admin, CustomRoutes, ListGuesser, Resource } from "react-admin";
import { Route } from "react-router-dom";
import { ModalContextProvider } from "./Modal/ModalConetxtProvider";
import jsonServerProvider from "ra-data-json-server";
import ApplicationLayout from "./Layout/ApplicationLayout";
import { useApplicationCustomRoutes } from "../Plugins/routes";
import { ApplicationAuthProvider } from "../providers/auth/authProvider";

export const App = () => {
    const LoginPage = React.lazy(() => import("./Login/LoginPage"));

    const custom_routes = useApplicationCustomRoutes();

    return (
        <ModalContextProvider>
            <Admin
                layout={ApplicationLayout}
                dataProvider={jsonServerProvider("https://jsonplaceholder.typicode.com/")}
                authProvider={ApplicationAuthProvider.getInstance()}
                loginPage={LoginPage}
                requireAuth
            >
                <Resource name="users" list={ListGuesser} />

                {/*    /!* Load our collections *!/*/}

                {/*    /!* Load additional collections from remote component*!/*/}
                {/*    <RemoteResource*/}
                {/*        name={"local-users"}*/}
                {/*        options={{ label: "Local Users" }}*/}
                {/*        list={() => <RemoteRaComponent component_id="auth-basic-user-list" load={<Loading />} />}*/}
                {/*        show={() => <RemoteRaComponent component_id="auth-basic-user-detail" load={<Loading />} />}*/}
                {/*        create={() => (*/}
                {/*            <RemoteRaComponent component_id="auth-basic-user-form" create={true} load={<Loading />} />*/}
                {/*        )}*/}
                {/*        edit={() => <RemoteRaComponent component_id="auth-basic-user-form" load={<Loading />} />}*/}
                {/*    />*/}

                {/*    <RemoteResource*/}
                {/*        name={"local-groups"}*/}
                {/*        options={{ label: "Local Groups" }}*/}
                {/*        list={() => <RemoteRaComponent component_id="auth-basic-group-list" load={<Loading />} />}*/}
                {/*        show={() => <RemoteRaComponent component_id="auth-basic-group-detail" load={<Loading />} />}*/}
                {/*    />*/}

                {/*    /!* Load custom routes *!/*/}
                <CustomRoutes>
                    {custom_routes.map((e) => (
                        <Route key={e.route} path={e.route} element={React.createElement(e.element, {})} />
                    ))}
                </CustomRoutes>
            </Admin>
        </ModalContextProvider>
    );
};
