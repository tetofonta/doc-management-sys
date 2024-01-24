import { CustomRouteDescriptor } from "../../Plugins/routes";
import React from "react";

export const DEFAULT_ROUTES: CustomRouteDescriptor[] = [
    {
        route: "/me",
        element: React.lazy(() => import("../CustomRoutes/CurrentAccountInfo/CurrentAccountInfo")),
    },
    {
        route: "/about",
        element: React.lazy(() => import("../CustomRoutes/About/About")),
        sideBar: { label: "About", icon: "Info" },
    },
];
