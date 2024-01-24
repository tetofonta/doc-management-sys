import { Divider, ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { useLogout, useUserMenu } from "react-admin";
import { useApplicationCustomRoutes } from "../../../../Plugins/routes";
import React, { ForwardedRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Logout } from "@mui/icons-material";
import { getIcon } from "../../../utils";
import { useModalContext } from "../../../Modal/modalContext";
import { YesNoDisplayModalProps, YesNoResult } from "../../../Modal/Modals/YesNoModal";
import LogoutButton from "./LogoutButton";
import MenuAvatar from "./MenuAvatar/MenuAvatar";

export interface CustomRouteUserMenuDescriptor {
    label: string;
    icon: string;
}

const RouteButton = React.lazy(() => import("./RouteButton"));

const ApplicationUserMenu = () => {
    const custom_routes = useApplicationCustomRoutes();
    const { onClose } = useUserMenu();

    return (
        <>
            <MenuAvatar />
            <Divider />
            {custom_routes
                .filter((e) => !!e.userMenu)
                .map((e) => (
                    <Suspense key={e.route}>
                        <RouteButton path={e.route} label={e.userMenu?.label || "??"} icon={e.userMenu?.icon} close={onClose} />
                    </Suspense>
                ))}
            <LogoutButton />
        </>
    );
};

export default ApplicationUserMenu;
