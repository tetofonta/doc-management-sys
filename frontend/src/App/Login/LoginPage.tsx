import "./css/common.sass";
import "./css/LoginPage.sass";
import { Box, CssBaseline, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import { MessageBox, MessageDialogType } from "../MessageBox/MessageBox";
import { Loading, UserIdentity } from "react-admin";
import LoginMethodList from "./LoginMethodList";
import { useLoginMethods } from "../../Plugins/login";

export type AuthComponentProps = {
    login: (x: { token: string; refresh_token: string }) => void;
    previousIdentity?: UserIdentity;
};

export type AuthMethodConfigType = {
    title: string;
    description?: string;
    component: React.FunctionComponent<AuthComponentProps> | React.ExoticComponent<AuthComponentProps>;
};

export type AuthMethodsConfigType = {
    [k: string]: AuthMethodConfigType;
};

const LoginPage = () => {
    const { methods, error } = useLoginMethods();

    return (
        <>
            <Grid container component="main" className="gridFullHeight">
                <CssBaseline />

                {/* Background image */}
                <Grid item xs={false} sm={4} md={7} className="loginImageBackground">
                    <div className="imageCopyright">
                        {" "}
                        Image source: <a href="https://source.unsplash.com/random">unsplash.com</a>
                    </div>
                </Grid>

                {/* Login forms */}
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} className="loginInteractionBoxContainer">
                    {error && <MessageBox title={"Error!"} message={error} type={MessageDialogType.ERROR} />}
                    {!error && !methods && <Loading />}
                    {!error && !!methods && (
                        <Box className="loginInteractionBox">
                            <Typography variant="h4">Welcome to DMS!</Typography>
                            <Typography variant="h6">Please Login</Typography>

                            <LoginMethodList conf={methods} />
                        </Box>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default LoginPage;
