import React, { ForwardedRef, useCallback } from "react";
import { Avatar, Box, MenuItem, Typography, Tooltip } from "@mui/material";
import { useApplicationAuthProvider } from "../../../../../providers/auth/context";
import { getAvatarColor } from "../../../../utils";
import "./style/style.sass";
import { useNavigate } from "react-router-dom";

const MenuAvatar = React.forwardRef((props, ref: ForwardedRef<any>) => {
    const authProvider = useApplicationAuthProvider();
    const identity = authProvider.getIdentitySync();
    const navigate = useNavigate();

    const navigateCb = useCallback(() => navigate("/me"), [navigate]);

    return (
        <Tooltip title={"Click for account infos"}>
            <MenuItem ref={ref} onClick={navigateCb}>
                <Avatar style={{ backgroundColor: getAvatarColor(identity?.id + "", identity?.source) }}>
                    {identity?.avatar}
                </Avatar>{" "}
                <Box className={"avatarText"}>
                    <Typography variant={"h6"}>{identity?.fullName}</Typography>
                    <Typography variant={"overline"}>{identity?.source}</Typography>
                </Box>
            </MenuItem>
        </Tooltip>
    );
});

MenuAvatar.displayName = "MenuAvatar";

export default MenuAvatar;
