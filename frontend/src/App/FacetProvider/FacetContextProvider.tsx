import React, { useCallback, useState } from "react";
import { FacetContext, FacetContextType, ResourcesFacetsType } from './facetContext';

export const FacetContextProvider = (props: { children: React.ReactElement[] | React.ReactElement }) => {
    const [resources, setResourceFacets] = useState<ResourcesFacetsType>({});

    const getContextValue = useCallback((): FacetContextType => {
        return {
            setFacets: (res_name: string, facets: ResourcesFacetsType) => {
                console.log("Updating facets", facets);
                setResourceFacets(Object.assign(resources, { [res_name]: facets }));
            },
            getFacets: (res: string) => {
                return resources[res];
            },
            resources,
        };
    }, [resources]);

    return <FacetContext.Provider value={getContextValue()}>{props.children}</FacetContext.Provider>;
};
