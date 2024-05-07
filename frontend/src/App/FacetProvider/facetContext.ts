import { createContext, useContext } from "react";

export type FacetContextType = {
    setFacets: (res: string, facets: ResourcesFacetsType) => void;
    getFacets: (resource: string) => ResourceFacetType
    resources: ResourcesFacetsType;
};

export type ResourceFacetType = { [k: string]: { name: string; count: number }[] };
export type ResourcesFacetsType = {
    [res_name: string]: ResourceFacetType;
};

export const FacetContext = createContext<FacetContextType>({
    setFacets: () => {},
    getFacets: () => null as unknown as ResourceFacetType,
    resources: {},
});

export const useFacetContext = () => useContext(FacetContext);
