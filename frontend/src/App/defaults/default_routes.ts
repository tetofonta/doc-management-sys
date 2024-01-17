import { CustomRouteDescriptor } from "../../Plugins/routes";
import React from "react";

export const DEFAULT_ROUTES: CustomRouteDescriptor[] = [
    {
        route: "/about",
        element: React.lazy(() => import("../CustomRoutes/About/About")),
        sideBar: { label: "About", icon: "Info" },
    },
];
