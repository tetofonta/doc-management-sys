import { Datagrid, TextField, BooleanField, FunctionField, Link, List, BulkDeleteButton } from "react-admin";
import { Chip } from "@mui/material";
import { useApplicationAuthProvider } from "../../../../providers/auth/context";

const renderGroupList = (record: { groups: { id: string; name: string }[] }) => {
    const len = record.groups.length > 5 ? 4 : record.groups.length;

    const groups = record.groups.slice(0, len).map((e) => {
        return {
            name: e.name,
            href: `/local-groups/${e.id}`,
        };
    });
    if (record.groups.length > 5) groups.push({ name: `+${record.groups.length - 4}`, href: "" });

    return (
        <div>
            {groups.map((e, i) => (
                <Chip key={i} label={e.href ? <Link to={e.href}>{e.name}</Link> : e.name} onClick={(e) => e.preventDefault()} />
            ))}
        </div>
    );
};

const BulkAction = () => {
    const auth = useApplicationAuthProvider();

    return <>{auth.hasPermissions("localuser:admin:delete") && <BulkDeleteButton />}</>;
};

const UserList = () => {
    return (
        <List>
            <Datagrid rowClick={"show"} bulkActionButtons={<BulkAction/>}>
                <TextField source={"id"} />
                <FunctionField label={"Groups"} render={renderGroupList} />
                <BooleanField source={"superuser"} />
                <BooleanField source={"enabled"} />
            </Datagrid>
        </List>
    );
};

export default UserList;
