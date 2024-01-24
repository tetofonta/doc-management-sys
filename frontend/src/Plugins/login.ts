import React, { createContext, useContext } from "react";
import { AuthMethodsConfigType } from "../App/Login/LoginPage";

export const LoginMethodsContext = createContext({
    methods: {
        basic: {
            title: "Password Login",
            description: "Simple password login using the local user account",
            component: React.lazy(() => import("./BasicAuth/Login/BasicLoginForm")),
        },
    } as AuthMethodsConfigType | undefined,
    error: "",
});

export const useLoginMethods = () => useContext(LoginMethodsContext);
