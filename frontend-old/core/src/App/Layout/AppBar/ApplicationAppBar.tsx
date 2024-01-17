import { AppBar, UserMenu } from "react-admin";
import ApplicationToolBar from "./ToolBar/ApplicationToolBar";
import { Typography } from "@mui/material";
import ApplicationUserMenu from "./UserMenu/ApplicationUserMenu";

const ApplicationAppBar = () => {
    return (
        <AppBar
            toolbar={<ApplicationToolBar />}
            userMenu={
                <UserMenu>
                    <ApplicationUserMenu />
                </UserMenu>
            }
        >
            <Typography
                flex="1"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
                fontWeight="bold"
                variant="h6"
                color="inherit"
            >
                DMS
            </Typography>
        </AppBar>
    );
};

export default ApplicationAppBar;
