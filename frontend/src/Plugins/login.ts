import React, { createContext, useContext } from "react";
import { AuthMethodsConfigType } from "../App/Login/LoginPage";

export const LoginMethodsContext = createContext({
    methods: {} as AuthMethodsConfigType | undefined,
    error: "",
});

export const useLoginMethods = () => useContext(LoginMethodsContext);
