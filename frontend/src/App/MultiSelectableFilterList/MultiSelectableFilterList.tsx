import { FilterList, FilterListItem } from "react-admin";
import React from "react";

export const MultiSelectableFilterList = (props: {
    label: string;
    items: string[];
    values: unknown[];
    filter_value: string;
    icon: React.ReactElement;
}) => {
    const { label, items, filter_value, icon, values } = props;

    const isSelected = (value: { value: string }, filters: any) => {
        return (filters[filter_value] || []).includes(value.value);
    };

    const toggleFilter = (value: { value: string }, filters: any) => {
        const elements = filters[filter_value] || [];
        return {
            ...filters,
            [filter_value]: elements.includes(value.value)
                ? // Remove the category if it was already present
                  elements.filter((v: string) => v !== value.value)
                : // Add the category if it wasn't already present
                  [...elements, value.value],
        };
    };

    return (
        <FilterList label={label} icon={icon}>
            {items.map((e, i) => (
                <FilterListItem label={e} key={i} value={{ value: values[i] }} isSelected={isSelected} toggleFilter={toggleFilter} />
            ))}
        </FilterList>
    );
};
