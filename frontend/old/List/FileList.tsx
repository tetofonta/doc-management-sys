import { Datagrid, List, ListProps, TextField } from "react-admin";
import { DirectoryContextProvider } from "../Directory/DirectoryContextProvider";
import { DirectoryChooser } from "../Directory/DirectoryChooser";
import { Box } from "@mui/material";

export const FileList = (props: ListProps) => {
    return (
        <DirectoryContextProvider>
            <Box style={{ padding: "1em" }}>
                <DirectoryChooser />
            </Box>
            <List {...props}>
                <Datagrid>
                    <TextField source={"id"} />
                </Datagrid>
            </List>
        </DirectoryContextProvider>
    );
};
