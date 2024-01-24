import React, { ForwardedRef } from "react";
import { useNavigate } from "react-router-dom";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { getIcon } from "../../../utils";

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
export default RouteButton;
