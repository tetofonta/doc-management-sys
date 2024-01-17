import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { CbProps, DisplayModalProps, ModalProps } from "../modalContext";

export enum YesNoAbortResult {
    YES,
    NO,
    ABORT,
    EXITED,
}

export interface YesNoAbortCbProps extends CbProps {
    result: YesNoAbortResult;
}

export interface YesNoAbortDisplayModalProps extends DisplayModalProps<YesNoAbortCbProps> {
    kind: "yesnoabort";
    display_message: string;
    title?: string;
}

const YesNoAbortModal = ({ props, show, close }: ModalProps<YesNoAbortCbProps, YesNoAbortDisplayModalProps>) => {
    return (
        <Dialog open={show} onClose={() => close({ result: YesNoAbortResult.EXITED })}>
            <DialogTitle>{props.title || "Confirmation required"}</DialogTitle>
            <DialogContent>
                <DialogContentText>{props.display_message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    color={"error"}
                    onClick={() => {
                        close({ result: YesNoAbortResult.ABORT });
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant={"contained"}
                    color={"error"}
                    onClick={() => {
                        close({ result: YesNoAbortResult.NO });
                    }}
                >
                    No
                </Button>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => {
                        close({ result: YesNoAbortResult.YES });
                    }}
                >
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default YesNoAbortModal;
