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
    useRecordContext,
    Button,
} from "react-admin";
import React, { useCallback } from "react";

const UserShowActions = () => {
    const authProvider = useAuthProvider() as any;
    const record = useRecordContext();
    const [deleteOne] = useDelete("local-users", {
        id: record?.id || "-",
        previousData: record,
    });

    const deleteCb = useCallback(() => deleteOne(), [record]);
    const resetPassword = useCallback(() => {}, [record]);

    return (
        <TopToolbar>
            {authProvider.hasPermissions("localuser:admin:reset") && (
                <Button color={"primary"}><>Reset Password</></Button>
            )}
            {authProvider.hasPermissions("localuser:admin:delete") && (
                <Button color={"secondary"} onClick={deleteCb}><>Delete</></Button>
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
                <BooleanField label={"Enabled"} source={"superuser"} />
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
