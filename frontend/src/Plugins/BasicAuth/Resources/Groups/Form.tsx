import { Create, SimpleForm, TextInput, required, ReferenceArrayInput, AutocompleteArrayInput, Edit } from "react-admin";
import { useEffect, useState } from "react";
import { useApplicationAuthProvider } from "../../../../providers/auth/context";

const InnerComponent = (props: { create: boolean }) => {
    const auth = useApplicationAuthProvider();
    const [features, setFeatures] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        auth.fetchJson("/api/local-groups/features/").then(({ json }) =>
            setFeatures(
                json.features.map((e: string) => ({
                    id: e,
                    name: e,
                })),
            ),
        );
    }, [auth]);

    return (
        <SimpleForm>
            <TextInput name="name" source="name" validate={props.create ? [required()] : []} />
            <ReferenceArrayInput
                source="users"
                name="users_autocomplete"
                reference="local-users"
                parse={(value) => value && value.map((v: string) => ({ id: v }))}
                format={(value) => value && value.map((v: { id: string }) => v.id)}
            >
                <AutocompleteArrayInput
                    optionText={"id"}
                    name="users"
                    filterToQuery={(t) => ({ id: { like: `%${t}%` } })}
                    parse={(value) => value && value.map((v: string) => ({ id: v }))}
                    format={(value) => value && value.map((v: { id: string }) => v.id)}
                />
            </ReferenceArrayInput>

            <AutocompleteArrayInput
                name="associated_features"
                source="associated_features"
                choices={features}
                createText="Add feature"
                onCreate={(e) => {
                    if (!e) return e;
                    setFeatures((f) => [...(f || []), { id: e, name: e }]);
                    return { id: e, name: e };
                }}
            />
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
