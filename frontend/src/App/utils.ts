import * as Icons from "@mui/icons-material";
import React from "react";

export const getIconFn = (icon?: string): React.FunctionComponent => {
    // @ts-expect-error Doin' wierd stuff with imports...
    return (Icons[icon || "QuestionMark"] as React.FunctionComponent) || Icons.QuestionMark;
};

export const getIcon = (icon?: string, props?: any): React.ReactElement => {
    return React.createElement(getIconFn(icon), props || {});
};
