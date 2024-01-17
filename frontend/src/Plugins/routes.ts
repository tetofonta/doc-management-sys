import React, { createContext, useContext } from "react";
import { CustomRouteSidebarDescriptor } from "../App/Layout/Menu/ApplicationMenu";
import { CustomRouteUserMenuDescriptor } from "../App/Layout/AppBar/UserMenu/ApplicationUserMenu";
import { CustomRouteToolbarDescriptor } from "../App/Layout/AppBar/ToolBar/ApplicationToolBar";
import { DEFAULT_ROUTES } from "../App/defaults/default_routes";

export interface CustomRouteDescriptor {
    route: string;
    element: React.FunctionComponent | React.ExoticComponent;
    sideBar?: CustomRouteSidebarDescriptor;
    userMenu?: CustomRouteUserMenuDescriptor;
    toolBar?: CustomRouteToolbarDescriptor;
}

export const CustomRoutesContext = createContext([...DEFAULT_ROUTES]);

export const useApplicationCustomRoutes = () => useContext(CustomRoutesContext);
