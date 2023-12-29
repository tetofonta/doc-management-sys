import { Box, CssBaseline, Grid, Paper, Typography } from "@mui/material";
import "./css/common.sass";
import "./css/LoginPage.sass";
import { useEffect, useState } from "react";
import { MessageBox, MessageDialogType } from "../MessageBox/MessageBox";
import { Loading } from "react-admin";
import LoginMethodList from "./LoginMethodList";

export type AuthMethodConfigType = {
    title?: string;
    description?: string;
    component: string;
};

export type AuthMethodsConfigType = {
    [k: string]: AuthMethodConfigType;
};

const LoginPage = () => {
    const [authConfig, setAuthConfig] = useState<AuthMethodsConfigType | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetch("/.well-known/fe-config/auth-methods.json")
            .then((r) => r.json())
            .then((r) => setAuthConfig(r))
            .catch((e) => setErrorMessage(`Cannot fetch auth options. ${e.toString()}`));
    }, []);

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
                    {errorMessage && <MessageBox title={"Error!"} message={errorMessage} type={MessageDialogType.ERROR} />}
                    {!errorMessage && !authConfig && <Loading />}
                    {!errorMessage && !!authConfig && (
                        <Box className="loginInteractionBox">
                            <Typography variant="h4">Welcome to DMS!</Typography>
                            <Typography variant="h6">Please Login</Typography>

                            <LoginMethodList conf={authConfig} />
                        </Box>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default LoginPage;
