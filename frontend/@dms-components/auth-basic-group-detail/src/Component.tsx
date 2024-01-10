import { BooleanField, Show, SimpleShowLayout, TextField } from "react-admin";
import React from 'react';
import { Typography } from "@mui/material";

export const Component = () => {
    return <Show>
        <SimpleShowLayout>
            <TextField source="name" variant={"h3"} />
            <TextField source="id" variant={"overline"} />
        </SimpleShowLayout>
    </Show>
};
