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
} from "react-admin";
import React from "react";


export const Component = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="username" validate={[required()]} />
                <PasswordInput source="password"  validate={[required()]} />
                <BooleanInput source="superuser" defaultValue={false}/>
                <BooleanInput source="enabled" defaultValue={true}/>

                <ReferenceArrayInput source="groups" reference="local-groups">
                    <AutocompleteArrayInput optionText={"name"} />
                </ReferenceArrayInput>
            </SimpleForm>
        </Create>
    );
};
