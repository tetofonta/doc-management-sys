import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { CbProps, DisplayModalProps, ModalProps } from "../modalContext";

export enum YesNoResult {
    YES,
    NO,
    EXITED,
}

export interface YesNoCbProps extends CbProps {
    result: YesNoResult;
}

export interface YesNoDisplayModalProps extends DisplayModalProps<YesNoCbProps> {
    kind: "yesno";
    display_message: string;
    title?: string;
}

const YesNoModal = ({ props, show, close }: ModalProps<YesNoCbProps, YesNoDisplayModalProps>) => {
    return (
        <Dialog open={show} onClose={() => close({ result: YesNoResult.EXITED })}>
            <DialogTitle>{props.title || "Confirmation required"}</DialogTitle>
            <DialogContent>
                <DialogContentText>{props.display_message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant={"contained"}
                    color={"error"}
                    onClick={() => {
                        close({ result: YesNoResult.NO });
                    }}
                >
                    No
                </Button>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => {
                        close({ result: YesNoResult.YES });
                    }}
                >
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default YesNoModal;
