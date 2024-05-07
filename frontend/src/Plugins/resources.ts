import { createContext, useContext } from "react";
import { AuthenticatedResourceProps } from "../App/Resources/AuthenticatedResource/AuthenticatedResource";
import UserResource from "./BasicAuth/Resources/UserResource";
import GroupResource from "./BasicAuth/Resources/GroupResource";

export type PluginResourceType = Omit<AuthenticatedResourceProps, "recordRepresentation">;

export const PluginResourcesContext = createContext<PluginResourceType[]>([UserResource, GroupResource]);

export const usePluginResources = () => useContext(PluginResourcesContext);
