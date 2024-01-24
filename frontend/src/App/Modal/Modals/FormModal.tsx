import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { CbProps, DisplayModalProps, ModalProps } from "../modalContext";
import React, { useCallback } from "react";

export interface FormCbProps extends CbProps {
    form_data: FormData;
}

export interface FormDisplayModalProps extends DisplayModalProps<FormCbProps> {
    kind: "form";
    form_content: React.ReactElement | string;
    title?: string;
}

const MessageModal = ({ props, show, close }: ModalProps<FormCbProps, FormDisplayModalProps>) => {
    const handleSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const form_data = new FormData(e.currentTarget);
            close({ form_data });
        },
        [close],
    );

    return (
        <Dialog open={show} onClose={close}>
            <Box component="form" noValidate onSubmit={handleSubmit}>
                <DialogTitle>{props.title || "Message"}</DialogTitle>
                <DialogContent>{props.form_content}</DialogContent>
                <DialogActions>
                    <Button type={"submit"}>Ok</Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default MessageModal;
