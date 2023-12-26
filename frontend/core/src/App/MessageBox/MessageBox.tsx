import "./css/MessageBox.sass";
import { Alert, AlertColor, Avatar, Box, Typography } from "@mui/material";
import {
    ErrorOutlined,
    InfoOutlined,
    WarningOutlined,
} from "@mui/icons-material";

export enum MessageDialogType {
    ERROR = "Error",
    WARN = "Warning",
    INFO = "Info",
}

export type MessageBoxProps = {
    title?: string;
    message?: string;
    type?: MessageDialogType;
    small?: boolean;
};

export const MessageBox = (props: MessageBoxProps) => {
    const type = props.type || MessageDialogType.INFO;
    const icon = (
        <Avatar className={["iconContainer" + type, "iconContainer"].join(" ")}>
            {type === MessageDialogType.ERROR && <ErrorOutlined />}
            {type === MessageDialogType.WARN && <WarningOutlined />}
            {type === MessageDialogType.INFO && <InfoOutlined />}
        </Avatar>
    );

    if (props.small) return icon;

    return (
        <Box className="messageContainer">
            {icon}
            <Typography variant="h5">{props.title}</Typography>
            {props.message && (
                <Alert
                    className="bodyContainer"
                    severity={type.toString().toLowerCase() as AlertColor}
                >
                    {props.message}
                </Alert>
            )}
        </Box>
    );
};
