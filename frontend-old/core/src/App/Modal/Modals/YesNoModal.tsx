import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";

export const YesNoModal = (props: { show: boolean; data: { message: React.ReactElement }; close: (...args: any) => void }) => {
    return (
        <Dialog open={props.show} onClose={props.close}>
            <DialogTitle>Confirmation required</DialogTitle>
            <DialogContent>
                <DialogContentText>{props.data.message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant={"contained"}
                    color={"error"}
                    onClick={() => {
                        props.close(false);
                    }}
                >
                    No
                </Button>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => {
                        props.close(true);
                    }}
                >
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};
