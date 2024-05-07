import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React, { Ref, RefObject, useEffect, useState } from "react";
import { CbProps, DisplayModalProps, ModalProps } from "../../../Modal/modalContext";
import { useApplicationAuthProvider } from "../../../../providers/auth/context";
import {
    AutocompleteArrayInput,
    Create,
    CreateBase,
    Loading,
    ResourceContextProvider,
    SimpleForm,
    TabbedForm,
    TextInput,
    useCreate,
} from "react-admin";
import { useDirectoryContext } from "../directoryContext";

export interface DirectoryUpsertProps extends CbProps {}

export interface DirectoryUpsertDisplayModalProps extends DisplayModalProps<DirectoryUpsertProps> {
    kind: "directory_upsert";
    mode: "create" | "update";
}

const DirectoryUpsertModal = ({ props, show, close }: ModalProps<DirectoryUpsertProps, DirectoryUpsertDisplayModalProps>) => {
    const dir = useDirectoryContext();
    const auth = useApplicationAuthProvider();
    const create_ref = React.useRef() as RefObject<any>;

    const permissions = [
        { id: "create_sub_dir", name: "Create Sub Dir" },
        { id: "metadata", name: "Edit Metadata" },
        { id: "upload", name: "Upload File" },
        { id: "list", name: "List" },
        { id: "delete", name: "Delete files and folders" },
    ];

    return (
        <Dialog open={show} onClose={close}>
            <DialogTitle>{props.mode == "create" ? "Create" : "Delete"} directory</DialogTitle>
            <DialogContent>
                <ResourceContextProvider value={"directories"}>
                    <CreateBase
                        mutationOptions={{ meta: { query_string: { root: dir.current?.id } } }}
                        redirect={() => {
                            close({});
                            return "files";
                        }}
                    >
                        <SimpleForm resource={"directories"}>
                            <TextInput name={"name"} source={"name"} />
                            <TextInput name={"owner"} source={"owner"} defaultValue={auth.getIdentitySync()?.user_id || ""} />
                            <TextInput name={"group"} source={"group"} defaultValue={auth.getIdentitySync()?.user_id || ""} />
                            <AutocompleteArrayInput
                                name="group_permissions"
                                source="group_permissions"
                                choices={permissions}
                                defaultValue={["list"]}
                            />
                            <AutocompleteArrayInput
                                name="guest_permissions"
                                source="guest_permissions"
                                choices={permissions}
                                defaultValue={["list"]}
                            />
                        </SimpleForm>
                    </CreateBase>
                </ResourceContextProvider>
            </DialogContent>
        </Dialog>
    );
};

export default DirectoryUpsertModal;
