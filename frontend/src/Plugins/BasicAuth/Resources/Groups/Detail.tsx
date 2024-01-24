import {
    BooleanField,
    Datagrid,
    FunctionField,
    RaRecord,
    ReferenceManyField,
    Show,
    TabbedShowLayout,
    TextField,
} from 'react-admin';
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useApplicationAuthProvider } from "../../../../providers/auth/context";

const GroupList = () => {
    const authProvider = useApplicationAuthProvider();
    return (
        <Show>
            <TabbedShowLayout>
                <TabbedShowLayout.Tab label={"General"}>
                    <TextField source="name" variant={"h3"} />
                    <TextField source="id" variant={"overline"} />

                    <FunctionField
                        render={(r: RaRecord) => (
                            <List>
                                {r?.associated_features?.map((e: string, i: number) => (
                                    <ListItem key={i} disablePadding>
                                        <ListItemButton>{e}</ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                        label={"Associated features"}
                    />
                </TabbedShowLayout.Tab>
                {authProvider.hasPermissions("localuser:list") && (
                    <TabbedShowLayout.Tab label={"Members"}>
                        <ReferenceManyField label="Users" reference="local-users" target="local-groups">
                            <Datagrid bulkActionButtons={false} rowClick={"show"}>
                                <TextField source="id" />
                                <BooleanField source="superuser" />
                                <BooleanField source="enabled" />
                            </Datagrid>
                        </ReferenceManyField>
                    </TabbedShowLayout.Tab>
                )}
            </TabbedShowLayout>
        </Show>
    );
};

export default GroupList;
