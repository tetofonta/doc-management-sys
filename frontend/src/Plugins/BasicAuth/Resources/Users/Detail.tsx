import {
    BooleanField,
    Button,
    CreateButton,
    Datagrid,
    EditButton,
    ReferenceManyField,
    Show,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    useAuthProvider,
    useCreatePath,
    useDelete,
    useNotify,
    useRecordContext,
} from "react-admin";
import { Delete, LockReset } from "@mui/icons-material";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApplicationAuthProvider } from "../../../../providers/auth/context";
import { useModalContext } from "../../../../App/Modal/modalContext";
import { YesNoDisplayModalProps, YesNoResult } from "../../../../App/Modal/Modals/YesNoModal";
import { MessageDisplayModalProps } from "../../../../App/Modal/Modals/MessageModal";

const UserShowActions = () => {
    const authProvider = useApplicationAuthProvider();
    const notify = useNotify();
    const createPath = useCreatePath();
    const navigate = useNavigate();
    const record = useRecordContext();
    const { display } = useModalContext();
    const [deleteOne] = useDelete();

    const deleteCb = useCallback(
        () =>
            display({
                kind: "yesno",
                display_message: `Are you really sure to delete user ${record.username} (id: ${record.id}`,
                cb: (x) => {
                    if (x.result == YesNoResult.YES) {
                        deleteOne(
                            "local-users",
                            {
                                id: record.id,
                                previousData: record,
                            },
                            {
                                onSuccess: () =>
                                    navigate(
                                        createPath({
                                            resource: "local-users",
                                            type: "list",
                                        }),
                                    ),
                            },
                        );
                    }
                },
            } as YesNoDisplayModalProps),
        [record, createPath, display, navigate, deleteOne],
    );
    const resetPassword = useCallback(() => {
        authProvider
            .fetchJson(`/api/local-users/${record.id}/`, {
                method: "PATCH",
            })
            .then((data: any) => {
                // notify(`New password is: ${data.json.psw}`, {type: "success"})
                display({
                    kind: "message",
                    type: "info",
                    display_message: `New password is: ${data.json.psw}`,
                } as MessageDisplayModalProps);
            })
            .catch(() =>
                notify("Cannot reset. See console for additional info.", {
                    type: "error",
                }),
            );
    }, [record, display, authProvider, notify]);

    return (
        <TopToolbar>
            {authProvider.hasPermissions("localuser:admin:reset") && (
                <Button color={"error"} label={"Reset password"} onClick={resetPassword} value={"Reset Password"}>
                    <LockReset />
                </Button>
            )}
            {authProvider.hasPermissions("localuser:admin:delete") && (
                <Button color={"error"} onClick={deleteCb} alignIcon={"left"} label={"Delete"}>
                    <Delete />
                </Button>
            )}
            {authProvider.hasPermissions("localuser:admin:create") && <CreateButton />}
            {authProvider.hasPermissions("localuser:admin:edit") && <EditButton />}
        </TopToolbar>
    );
};

const UserDetail = () => {
    const authProvider = useApplicationAuthProvider();

    return (
        <Show actions={<UserShowActions />}>
            <SimpleShowLayout>
                <TextField source="id" label={"Username"} variant={"h3"} />

                <BooleanField label={"Enabled"} source={"enabled"} />
                <BooleanField label={"Superuser"} source={"superuser"} />
                <TextField label={"Last Login"} source={"lastLogin"} />
                <TextField label={"Last Password Change"} source={"lastPasswordChange"} />

                {authProvider.hasPermissions("localgroups:list") && (
                    <ReferenceManyField label="Groups" reference="local-groups" target="local-users">
                        <Datagrid bulkActionButtons={false} rowClick={"show"}>
                            <TextField source="name" />
                        </Datagrid>
                    </ReferenceManyField>
                )}
            </SimpleShowLayout>
        </Show>
    );
};

export default UserDetail;
