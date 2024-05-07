import {
    Datagrid,
    FunctionField,
    List,
    ListProps,
    SavedQueriesList,
    SearchInput,
    TextField,
    useRecordContext,
    useResourceContext,
} from "react-admin";
import { Card, CardContent } from "@mui/material";
import { StringArrayField } from "../../StringArrayField/StringArrayField";
import { useCallback, useEffect, useState } from "react";
import { Category, InsertDriveFile } from "@mui/icons-material";
import { useFacetContext } from "../../FacetProvider/facetContext";
import { MultiSelectableFilterList } from "../../MultiSelectableFilterList/MultiSelectableFilterList";
import { ResourceAutocompleteArrayInput } from "../../ResourceAutocompleteArrayInput/ResourceAutocompleteArrayInput";

export const FileList = (props: ListProps) => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const facets_context = useFacetContext();
    const [facets, setFacets] = useState(facets_context.getFacets(resource));

    useEffect(() => {
        setTimeout(() => setFacets(facets_context.getFacets(resource)), 500);
    }, [record, resource, facets_context]);

    const filter_middleware = useCallback(
        (filter: any) => {
            let q = (filter.q || "") as string;
            q +=
                " " +
                Object.keys(facets || {})
                    .map((facet) => {
                        if (!filter[facet] || !Array.isArray(filter[facet]) || filter[facet].length === 0) return "";
                        if (filter[facet].length == 1) return `${facet}:=\`${filter[facet][0]}\`]`;
                        return `${facet}:=[${filter[facet].map((e: string) => `\`${e}\``).join(", ")}]`;
                    })
                    .filter(Boolean)
                    .join(" ");
            q += " " + (filter?._tag?.map((e: string) => `tag:=\`${e}\``).join(" ") || "");
            q += " " + (filter?._category?.map((e: string) => `category:=\`${e}\``).join(" ") || "");
            return { q };
        },
        [facets],
    );

    return (
        <List
            {...props}
            filters={[
                <SearchInput key="search" name="q" source="q" alwaysOn />,
                <ResourceAutocompleteArrayInput
                    key="tag"
                    res="files/tag"
                    meta={{ filter_in_query: true, filter_middleware }}
                    source={"_tag"}
                />,
                <ResourceAutocompleteArrayInput
                    key="category"
                    res="files/category"
                    meta={{ filter_in_query: true, filter_middleware }}
                    source={"_category"}
                />,
            ]}
            queryOptions={{ meta: { filter_in_query: true, filter_middleware } }}
            aside={
                <Card sx={{ order: -1, mr: 2, mt: 9, width: 300 }}>
                    <CardContent>
                        <SavedQueriesList />
                        {Object.keys(facets || {}).map((facet, i) => (
                            <MultiSelectableFilterList
                                key={i}
                                label={facet}
                                items={facets[facet].map((e) => `${e.name} - ${e.count}`)}
                                values={facets[facet].map((e) => e.name)}
                                filter_value={facet}
                                icon={<Category />}
                            />
                        ))}
                    </CardContent>
                </Card>
            }
        >
            <Datagrid>
                <FunctionField
                    label="Thumbnail"
                    render={(r: any) => {
                        return r.thumbnail ? <img height="50" src={r.thumbnail}/> : <InsertDriveFile  style={{ height: 50, color: "gray"}} />
                    }}
                />
                <TextField label="Title" source="title" />
                <TextField label="Category" source="category" />
                <FunctionField
                    label="Owner"
                    render={(r: any) => {
                        return (
                            <>
                                {r.owner || <i>Unknown</i>}
                                {r.group ? `:${r.group}` : ""}
                            </>
                        );
                    }}
                />
                <StringArrayField source="tag" max_display={3} />
            </Datagrid>
        </List>
    );
};
