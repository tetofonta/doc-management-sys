import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const getTitle = (type: string): string => {
    switch (type) {
        case "info":
            return "Information";
        case "warn":
            return "Warning!";
        case "error":
            return "Error";
        case "fatal":
            return "Fatal Error";
    }
    return "???";
};

export const MessageModal = (props: { show: boolean; message: string; type: string; close: () => void }) => {
    return (
        <Dialog open={props.show} onClose={props.close}>
            <DialogTitle>{getTitle(props.type)}</DialogTitle>
            <DialogContent>
                <DialogContentText>{props.message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.close}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
};
