import { useNotify } from "react-admin";
import { useModalContext } from "../../../App/Modal/modalContext";
import { Button, TextField } from "@mui/material";
import { useCallback } from "react";
import { useApplicationAuthProvider } from "../../../providers/auth/context";
import { FormCbProps, FormDisplayModalProps } from "../../../App/Modal/Modals/FormModal";

const ChangePasswordButton = () => {
    const auth = useApplicationAuthProvider();
    const notify = useNotify();
    const { display } = useModalContext();

    const handleSubmit = useCallback(
        (d: FormCbProps) => {
            const data = d.form_data;
            auth.fetchJson("/api/auth/basic/", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    current_password: data.get("current_password")?.toString() || "",
                    new_password: data.get("new_password")?.toString() || "",
                }),
            })
                .then(() => notify("Password changed", { type: "success" }))
                .catch(() => notify("Cannot change password. See console for additional error detail.", { type: "error" }));
        },
        [notify, auth],
    );

    const changePasswordCb = useCallback(() => {
        display({
            kind: "form",
            title: "Change Password",
            cb: handleSubmit,
            form_content: (
                <>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        label="Current Password"
                        name="current_password"
                        type="password"
                        autoComplete="current-password"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        label="New Password"
                        name="new_password"
                        type="password"
                        autoFocus
                    />
                </>
            ),
        } as FormDisplayModalProps);
    }, [display, handleSubmit]);

    return (
        <Button color={"primary"} onClick={changePasswordCb}>
            Change Password
        </Button>
    );
};

export default ChangePasswordButton;
