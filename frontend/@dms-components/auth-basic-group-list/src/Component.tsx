import {
    Datagrid,
    TextField,
    List,
    BooleanField,
    FunctionField,
    NumberField,
} from "react-admin";
import React from 'react';

export const Component = () => {
    return <List>
        <Datagrid rowClick={"show"}>
            <TextField source={"name"}/>
            <NumberField source={"userCount"}/>
        </Datagrid>
    </List>
};
