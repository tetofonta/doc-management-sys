import React, { createContext, ExoticComponent, FunctionComponent, useContext } from "react";

export type UserProfileComponents = {
    group: string;
    source?: string;
    component: FunctionComponent | ExoticComponent;
};

export const UserProfileComponentsContext = createContext<UserProfileComponents[]>([
    {
        group: "Basic User Password",
        source: "basic",
        component: React.lazy(() => import("./BasicAuth/UserProfileComponents/ChangePasswordButton")),
    },
]);

export const useUserProfileComponentsContext = () => useContext(UserProfileComponentsContext);
