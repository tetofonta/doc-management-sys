import {
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
import "./style/form.sass";
import { Tooltip } from "@mui/material";
import { Info } from "@mui/icons-material";

const InnerComponent = (props: { create: boolean }) => {
    return (
        <SimpleForm>
            <TextInput name="id" source="id" validate={props.create ? [required()] : []} />
            {props.create && (
                <div className={"hContainer"}>
                    <PasswordInput name="password" source="password" />
                    <Tooltip title={"If nothing is set a random password will be generate making the password reset needed."}>
                        <Info />
                    </Tooltip>
                </div>
            )}
            <BooleanInput name="superuser" source="superuser" defaultValue={false} />
            <BooleanInput name="enabled" source="enabled" defaultValue={true} />

            <ReferenceArrayInput
                source="groups"
                name="groups_autocomplete"
                reference="local-groups"
                parse={(value) => value && value.map((v: string) => ({ id: v }))}
                format={(value) => value && value.map((v: { id: string }) => v.id)}
            >
                <AutocompleteArrayInput
                    optionText={"name"}
                    name="groups"
                    filterToQuery={(t) => ({ name: { like: `%${t}%` } })}
                    parse={(value) => value && value.map((v: string) => ({ id: v }))}
                    format={(value) => value && value.map((v: { id: string }) => v.id)}
                />
            </ReferenceArrayInput>
        </SimpleForm>
    );
};

const UserForm = (props: { create: boolean }) => {
    return props.create ? (
        <Create redirect={"show"}>
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

export default UserForm;
