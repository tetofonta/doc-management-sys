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
    Create,
    SimpleForm,
    TextInput,
    required,
    BooleanInput,
    ReferenceArrayInput,
    AutocompleteArrayInput,
    PasswordInput,
    Edit,
    useSaveContext,
} from "react-admin";
import React from "react";
import "./style.sass";
import { Tooltip } from "@mui/material";
import { Info } from "@mui/icons-material";

const InnerComponent = (props: { create: boolean }) => {
    console.log(useSaveContext())
    return (
        <SimpleForm>
            <TextInput
                source="username"
                validate={props.create ? [required()] : []}
            />
            {props.create && (
                <div className={"hContainer"}>
                    <PasswordInput source="password" />
                    <Tooltip
                        title={
                            "If nothing is set a random password will be generate making the password reset needed."
                        }
                    >
                        <Info />
                    </Tooltip>
                </div>
            )}
            <BooleanInput source="superuser" defaultValue={false} />
            <BooleanInput source="enabled" defaultValue={true} />

            <ReferenceArrayInput
                source="groups"
                reference="local-groups"
                parse={(value) => value && value.map((v: any) => ({ id: v }))}
                format={(value) => value && value.map((v: any) => v.id)}
            >
                <AutocompleteArrayInput
                    optionText={"name"}
                    filterToQuery={(t) => ({ name: { like: `%${t}%` } })}
                    parse={(value) => value && value.map((v: any) => ({ id: v }))}
                    format={(value) => value && value.map((v: any) => v.id)}
                />
            </ReferenceArrayInput>
        </SimpleForm>
    );
};

export const Component = (props: { create: boolean }) => {
    return props.create ? (
        <Create redirect={"show"} >
            {" "}
            <InnerComponent create={props.create} />{" "}
        </Create>
    ) : (
        <Edit redirect={"show"}>
            {" "}
            <InnerComponent create={props.create} />{" "}
        </Edit>
    );
};
