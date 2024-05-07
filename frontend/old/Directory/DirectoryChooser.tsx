import { DirectoryBreadcrumb } from "./DirectoryBreadcrumb";
import { Datagrid, FunctionField, List, RaRecord, ResourceContextProvider, RowClickFunction, TextField } from "react-admin";
import { useDirectoryContext } from "./directoryContext";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useModalContext } from "../../Modal/modalContext";
import { DirectoryUpsertDisplayModalProps } from "./Modal/DirectoryUpsertModal";
import { Folder } from "@mui/icons-material";

const DirChooseActions = () => {
    const dir = useDirectoryContext();
    const { display } = useModalContext();
    return (
        <>
            {dir.canCreate() && (
                <Button
                    onClick={() =>
                        display({
                            kind: "directory_upsert",
                            mode: "create",
                        } as DirectoryUpsertDisplayModalProps)
                    }
                    startIcon={<Add />}
                >
                    Create
                </Button>
            )}
        </>
    );
};

export const DirectoryChooser = () => {
    const dir = useDirectoryContext();

    return (
        <>
            <DirectoryBreadcrumb />
            <ResourceContextProvider value={"directories"}>
                <List
                    queryOptions={{ meta: { query_params: { root: dir.current?.id, recursive: false } } }}
                    empty={false}
                    actions={<DirChooseActions />}
                >
                    <Datagrid
                        empty={undefined}
                        rowClick={
                            (async (id) => {
                                await dir.push(id as string);
                                return false;
                            }) as RowClickFunction
                        }
                    >
                        <Folder />
                        <TextField source={"name"} />
                        <FunctionField render={(r: RaRecord) => `${r.owner}:${r.group}`} label={"Ownership"} />
                    </Datagrid>
                </List>
            </ResourceContextProvider>
        </>
    );
};
