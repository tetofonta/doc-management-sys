import { AppBar, TitlePortal, UserMenu } from "react-admin";
import ApplicationToolBar from "./ToolBar/ApplicationToolBar";
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
            <TitlePortal style={{ fontWeight: "bold" }}>DMS - </TitlePortal>
            <div>{/*TODO ADD COMPONENTS IN THE CENTER OR NEAR THE TITLE*/}</div>
        </AppBar>
    );
};

export default ApplicationAppBar;
