import { AutocompleteArrayInput, TextInput, useGetList } from "react-admin";
import { useEffect, useState } from "react";

export type ResourceAutocompleteArrayInputProps = {
    res: string;
    meta: any;
    source: string;
};

export const ResourceAutocompleteArrayInput = (props: ResourceAutocompleteArrayInputProps) => {
    const [filter, setFilter] = useState<string>("");
    const [selected, setSelected] = useState<string[]>([]);

    const { data, total, isLoading, error, refetch } = useGetList(props.res, {
        pagination: { page: 1, perPage: 20 },
        filter: { q: filter },
        meta: props.meta,
    });

    return (
        <AutocompleteArrayInput
            source={props.source}
            setFilter={(e) => setFilter(e)}
            onChange={(e) => setSelected(e)}
            choices={
                [...new Set([...(data || []), ...selected.map((e) => ({ id: e }))])].map((e) => ({
                    id: e.id,
                    name: e.id,
                })) || []
            }
        />
    );
};
