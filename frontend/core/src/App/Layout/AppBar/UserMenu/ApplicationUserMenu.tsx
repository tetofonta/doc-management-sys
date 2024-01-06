import { Info } from "@mui/icons-material";
import { Divider, ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import React, { ForwardedRef } from "react";
import { Logout, useUserMenu } from "react-admin";
import { useNavigate } from "react-router-dom";

const AboutButton = React.forwardRef((props: { close: () => void }, ref: ForwardedRef<any>) => {
    const navigate = useNavigate();
    return (
        <MenuItem
            onClick={() => {
                props.close();
                navigate("/about");
            }}
            ref={ref}
            {...props}
        >
            <ListItemIcon>
                <Info fontSize="small" />
            </ListItemIcon>
            <ListItemText>About</ListItemText>
        </MenuItem>
    );
});

AboutButton.displayName = "ActionButton";

const ApplicationUserMenu = () => {
    const { onClose } = useUserMenu();
    return (
        <>
            {/* TODO: Load components for static and for resource*/}
            <AboutButton close={onClose} />
            <Divider />
            <Logout />
        </>
    );
};

export default ApplicationUserMenu;
