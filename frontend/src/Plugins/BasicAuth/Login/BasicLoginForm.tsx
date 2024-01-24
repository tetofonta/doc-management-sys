import "./style/style.sass";
import { AuthComponentProps } from "../../../App/Login/LoginPage";
import React, { useCallback, useState } from "react";
import { Alert, Avatar, Box, Button, CircularProgress, Typography, TextField } from "@mui/material";

const BasicLoginForm = (props: AuthComponentProps) => {
    const [loggingIn, setLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [previousIdentity, setPreviousIdentity] = useState(props.previousIdentity);

    const handleSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            setLoggingIn(true);

            fetch("/api/auth/basic/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: data.get("username")?.toString() || "",
                    password: data.get("password")?.toString() || "",
                }),
            })
                .then((res) => {
                    if (res.status == 200) {
                        return res.json();
                    } else {
                        setLoginError(`Login failed`);
                        setLoggingIn(false);
                    }
                })
                .then((res) => {
                    if (!res) return;
                    props.login({
                        token: res.token || "",
                        refresh_token: res.refresh_token || "",
                    });
                    setLoggingIn(false);
                })
                .catch((e) => {
                    setLoginError(`Error during login request. ${e.toString()}`);
                    setLoggingIn(false);
                });
        },
        [props],
    );

    return (
        <>
            {previousIdentity && <Avatar className="localLoginAvatar">{previousIdentity.avatar}</Avatar>}

            <Typography component="h1" variant="h5">
                {previousIdentity ? `Welcome back, ${previousIdentity.fullName}` : "Please Sign in"}
            </Typography>
            <Box component="form" className="loginBox" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                {previousIdentity ? (
                    <input type="hidden" name="username" id="username" value={previousIdentity.fullName} />
                ) : (
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        error={!!loginError}
                    />
                )}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    error={!!loginError}
                    autoFocus={!!previousIdentity}
                />
                {!!loginError && <Alert severity={"error"}>{loginError}</Alert>}
                {previousIdentity && <Button onClick={() => setPreviousIdentity(undefined)}>Not You?</Button>}
                <Button type="submit" fullWidth variant="contained" disabled={loggingIn} sx={{ mt: 3, mb: 2 }}>
                    {loggingIn ? <CircularProgress /> : <>Sign In</>}
                </Button>
            </Box>
        </>
    );
};

export default BasicLoginForm;
