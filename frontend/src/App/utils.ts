import * as Icons from "@mui/icons-material";
import React from "react";

export const getIconFn = (icon?: string): React.FunctionComponent => {
    // @ts-expect-error Doin' wierd stuff with imports...
    return (Icons[icon || "QuestionMark"] as React.FunctionComponent) || Icons.QuestionMark;
};

export const getIcon = (icon?: string, props?: any): React.ReactElement => {
    return React.createElement(getIconFn(icon), props || {});
};

export const getAvatarColor = (id?: string, source?: string) => {
    let hash = 0;
    ((id || "-") + (source || "")).split("").forEach((char) => {
        hash = char.charCodeAt(0) + ((hash << 5) - hash);
    });
    let colour = "#";
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        colour += value.toString(16).padStart(2, "0");
    }
    return colour;
};
