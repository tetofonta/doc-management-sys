import { Alert, AlertColor, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { CbProps, DisplayModalProps, ModalProps } from "../modalContext";
import React from "react";

export interface MessageCbProps extends CbProps {}

export interface MessageDisplayModalProps extends DisplayModalProps<MessageCbProps> {
    kind: "message";
    display_message: React.ReactElement | string;
    title?: string;
    type?: AlertColor;
}

const MessageModal = ({ props, show, close }: ModalProps<MessageCbProps, MessageDisplayModalProps>) => {
    return (
        <Dialog open={show} onClose={close}>
            <DialogTitle>{props.title || "Message"}</DialogTitle>
            <DialogContent>
                <Alert severity={props.type || "info"}>{props.display_message}</Alert>
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MessageModal;
