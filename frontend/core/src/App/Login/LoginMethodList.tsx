import { useEffect, useState } from "react";
import { useAuthProvider, useLogin } from "react-admin";
import { ApplicationAuthProvider } from "../../providers/authProvider";
import { MessageBox, MessageDialogType } from "../MessageBox/MessageBox";
import { Box, Button, CircularProgress, List, ListItemButton, ListItemIcon, ListItemText, Slide } from "@mui/material";
import { ArrowLeft, Login } from "@mui/icons-material";
import { RemoteComponent } from "../Remote/RemoteComponent";
import { AuthMethodConfigType, AuthMethodsConfigType } from "./LoginPage";

import "./css/common.sass";
import "./css/LoginMethodList.sass";

const LoginMethodList = (props: { conf: AuthMethodsConfigType }) => {
    const requested_plugin_string = window.location.hash.split("#").at(-1);

    const [selectedLogin, setSelectedLogin] = useState<AuthMethodConfigType | undefined>(
        props.conf[requested_plugin_string || "login"],
    );
    const login = useLogin();
    const authProvider = useAuthProvider() as ApplicationAuthProvider;

    return (
        <>
            {Object.keys(props.conf).length == 0 && (
                <MessageBox
                    title={"No auth method found!"}
                    message={"the returned frontend configuration does not contain any authentication method component"}
                    type={MessageDialogType.WARN}
                />
            )}

            {Object.keys(props.conf).length > 0 && (
                <Box className="loginListContainer">
                    <Slide direction="right" in={!selectedLogin} mountOnEnter unmountOnExit>
                        <List component="nav" className="loginList">
                            {Object.keys(props.conf).map((method) => (
                                <ListItemButton key={method} onClick={() => setSelectedLogin(props.conf[method])}>
                                    <ListItemIcon>
                                        <Login />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            props.conf[method].title || `Unnamed component <${props.conf[method].component}/>`
                                        }
                                        secondary={props.conf[method].description || ""}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Slide>

                    <Slide direction="left" in={!!selectedLogin} mountOnEnter unmountOnExit>
                        <Box className="loginInteractionBox">
                            {selectedLogin && (
                                <RemoteComponent
                                    component_id={selectedLogin.component}
                                    load={<CircularProgress />}
                                    perform_login={login}
                                    previous_identity={authProvider.getPreviousIdentity()}
                                    error={(m) => (
                                        <MessageBox title={"Component load error"} message={m} type={MessageDialogType.ERROR} />
                                    )}
                                />
                            )}
                            <Button
                                className="footerButton"
                                fullWidth
                                startIcon={<ArrowLeft />}
                                onClick={() => setSelectedLogin(undefined)}
                            >
                                Back to the list
                            </Button>
                        </Box>
                    </Slide>
                </Box>
            )}
        </>
    );
};

export default LoginMethodList;
