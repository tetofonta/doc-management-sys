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
import { Card, CardContent, Typography } from "@mui/material";
import { StringArrayField } from "../../StringArrayField/StringArrayField";
import { useCallback, useEffect, useState } from "react";
import { Category, InsertDriveFile } from "@mui/icons-material";
import { useFacetContext } from "../../FacetProvider/facetContext";
import { MultiSelectableFilterList } from "../../MultiSelectableFilterList/MultiSelectableFilterList";
import { ResourceAutocompleteArrayInput } from "../../ResourceAutocompleteArrayInput/ResourceAutocompleteArrayInput";
import DOMPurify from 'dompurify';

export const FileSearch = (props: ListProps) => {
    return (
        <List
            {...props}
            filters={[<SearchInput key="search" name="q" source="q" alwaysOn />]}
            queryOptions={{ meta: { filter_in_query: true } }}
        >
            <Datagrid>
                <FunctionField
                    label="Thumbnail"
                    render={(r: any) => {
                        return r.thumbnail ? (
                            <img height="50" src={r.thumbnail} />
                        ) : (
                            <InsertDriveFile style={{ height: 50, color: "gray" }} />
                        );
                    }}
                />
                <FunctionField
                    label="Record"
                    render={(r: any) => {
                        return (
                            <div>
                                <Typography variant={"h6"} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(r.title, {ALLOWED_TAGS: ['mark']})}}/>
                                {r.chunk_type != "title" && !!r.highlight && <Typography variant={"body2"} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(r.highlight, {ALLOWED_TAGS: ['mark']})}} />}
                            </div>
                        );
                    }}
                />
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
