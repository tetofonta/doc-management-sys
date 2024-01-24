import { Datagrid, List, TextField } from "react-admin";

const GroupList = () => {
    return (
        <List>
            <Datagrid rowClick={"show"}>
                <TextField source={"name"} />
                <TextField source={"userCount"} />
            </Datagrid>
        </List>
    );
};

export default GroupList;
