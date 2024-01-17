import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { CbProps, DisplayModalProps, ModalProps } from "../modalContext";
import { YesNoCbProps, YesNoDisplayModalProps } from "./YesNoModal";

export interface MessageCbProps extends CbProps {}

export interface MessageDisplayModalProps extends DisplayModalProps<MessageCbProps> {
    kind: "message";
    display_message: string;
    title?: string;
}

const MessageModal = ({ props, show, close }: ModalProps<MessageCbProps, MessageDisplayModalProps>) => {
    return (
        <Dialog open={show} onClose={close}>
            <DialogTitle>{props.title || "Message"}</DialogTitle>
            <DialogContent>
                <DialogContentText>{props.display_message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MessageModal;
