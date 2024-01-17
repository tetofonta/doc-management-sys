import {
    BooleanField,
    CreateButton,
    Datagrid,
    EditButton,
    ReferenceManyField,
    Show,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    useAuthProvider,
    useDelete,
    useNotify,
    useRecordContext,
    Button,
    useCreatePath,
} from "react-admin";
import { Delete, LockReset } from "@mui/icons-material";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useModalContext } from "@dms/modal-context";

const UserShowActions = () => {
    const authProvider = useAuthProvider() as any;
    const notify = useNotify();
    const createPath = useCreatePath();
    const navigate = useNavigate();
    const record = useRecordContext();
    const { display } = useModalContext();
    const [deleteOne] = useDelete();

    const deleteCb = useCallback(
        () =>
            display(
                "yesno",
                {
                    message: `Are you really sure to delete user ${record.username} (id: ${record.id}`,
                },
                (x: boolean) => {
                    if (x) {
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
            ),
        [record],
    );
    const resetPassword = useCallback(() => {
        authProvider
            .fetchJson(`/api/local-users/${record.id}/`, {
                method: "PATCH",
            })
            .then((data: any) => {
                // notify(`New password is: ${data.json.psw}`, {type: "success"})
                display("message", {
                    type: "info",
                    message: `New password is: ${data.json.psw}`,
                });
            })
            .catch(() =>
                notify("Cannot reset. See console for additional info.", {
                    type: "error",
                }),
            );
    }, [record]);

    return (
        <TopToolbar>
            {authProvider.hasPermissions("localuser:admin:reset") && (
                <Button
                    color={"error"}
                    label={"Reset password"}
                    onClick={resetPassword}
                    value={"Reset Password"}
                >
                    <LockReset />
                </Button>
            )}
            {authProvider.hasPermissions("localuser:admin:delete") && (
                <Button
                    color={"error"}
                    onClick={deleteCb}
                    alignIcon={"left"}
                    label={"Delete"}
                >
                    <Delete />
                </Button>
            )}
            {authProvider.hasPermissions("localuser:admin:create") && (
                <CreateButton />
            )}
            {authProvider.hasPermissions("localuser:admin:edit") && (
                <EditButton />
            )}
        </TopToolbar>
    );
};

export const Component = () => {
    const authProvider = useAuthProvider() as any;

    return (
        <Show actions={<UserShowActions />}>
            <SimpleShowLayout>
                <TextField source="username" variant={"h3"} />
                <TextField source="id" variant={"overline"} />

                <BooleanField label={"Enabled"} source={"enabled"} />
                <BooleanField label={"Superuser"} source={"superuser"} />
                <TextField label={"Last Login"} source={"lastLogin"} />
                <TextField
                    label={"Last Password Change"}
                    source={"lastPasswordChange"}
                />

                {authProvider.hasPermissions("localgroups:list") && (
                    <ReferenceManyField
                        label="Groups"
                        reference="local-groups"
                        target="local-users"
                    >
                        <Datagrid bulkActionButtons={false} rowClick={"show"}>
                            <TextField source="name" />
                        </Datagrid>
                    </ReferenceManyField>
                )}
            </SimpleShowLayout>
        </Show>
    );
};
