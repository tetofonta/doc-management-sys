import {
    Datagrid,
    TextField,
    List,
    BooleanField,
    FunctionField,
    useResourceContext,
    Link,
} from "react-admin";
import { Chip } from "@mui/material"
import React from 'react';

const renderGroupList = (record: {groups: {id: string, name: string}[]}) => {
    const len = record.groups.length > 5 ? 4 : record.groups.length


    const groups = record.groups.slice(0, len).map(e => {
        return {
            name: e.name,
            href: `/local-groups/${e.id}`
        }
    })
    if (record.groups.length > 5) groups.push({name: `+${record.groups.length - 4}`, href: ""})

    return (
        <div>
            {groups.map((e) => (
                <Chip
                    label={e.href ? <Link to={e.href}>{e.name}</Link> : e.name}
                />
            ))}
        </div>
    );
}

export const Component = () => {
    return <List>
        <Datagrid rowClick={"show"}>
            <TextField source={"username"}/>

            <FunctionField label={"Groups"} render={renderGroupList}/>

            <BooleanField source={"superuser"}/>
            <BooleanField source={"enabled"}/>
        </Datagrid>
    </List>
};
