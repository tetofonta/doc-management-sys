import { Divider, ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { Logout, Menu, useUserMenu } from "react-admin";
import { useApplicationCustomRoutes } from "../../../../Plugins/routes";
import React, { ForwardedRef } from "react";
import { useNavigate } from "react-router-dom";
import { Info } from "@mui/icons-material";
import { getIcon, getIconFn } from "../../../utils";

export interface CustomRouteUserMenuDescriptor {
    label: string;
    icon: string;
}

const RouteButton = React.forwardRef(
    (
        props: {
            close: () => void;
            path: string;
            icon?: string;
            label: string;
        },
        ref: ForwardedRef<any>,
    ) => {
        const navigate = useNavigate();
        return (
            <MenuItem
                onClick={() => {
                    props.close();
                    navigate(props.path);
                }}
                ref={ref}
                {...props}
            >
                <ListItemIcon>{getIcon(props.icon, { fontSize: "small" })}</ListItemIcon>
                <ListItemText>{props.label}</ListItemText>
            </MenuItem>
        );
    },
);

RouteButton.displayName = "RouteButton";

const ApplicationUserMenu = () => {
    const custom_routes = useApplicationCustomRoutes();
    const { onClose } = useUserMenu();

    return (
        <>
            {custom_routes
                .filter((e) => !!e.userMenu)
                .map((e) => (
                    <RouteButton
                        key={e.route}
                        path={e.route}
                        label={e.userMenu?.label || "??"}
                        icon={e.userMenu?.icon}
                        close={onClose}
                    />
                ))}
            <Divider />
            <Logout />
        </>
    );
};

export default ApplicationUserMenu;
