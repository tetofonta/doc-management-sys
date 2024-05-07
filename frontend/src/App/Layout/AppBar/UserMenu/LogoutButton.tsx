import React, { ForwardedRef } from "react";
import { useModalContext } from "../../../Modal/modalContext";
import { useLogout } from "react-admin";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { YesNoDisplayModalProps, YesNoResult } from "../../../Modal/Modals/YesNoModal";
import { Logout } from "@mui/icons-material";

const LogoutButton = React.forwardRef((props, ref: ForwardedRef<any>) => {
    const { display } = useModalContext();
    const logout = useLogout();

    return (
        <MenuItem
            onClick={() => {
                display({
                    kind: "yesno",
                    title: "Logout",
                    display_message: "Are you sure to logout?",
                    cb: async (r) => {
                        if (r.result == YesNoResult.YES) await logout();
                        return true;
                    },
                } as YesNoDisplayModalProps);
            }}
            ref={ref}
        >
            <ListItemIcon>
                <Logout />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
        </MenuItem>
    );
});

LogoutButton.displayName = "LogoutButton";

export default LogoutButton;
