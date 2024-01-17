import * as React from "react";
import { Resource, ResourceProps } from "react-admin";

const RemoteResource = (props: ResourceProps) => {
    return <Resource {...props} />;
};

RemoteResource.raName = "Resource";
RemoteResource.registerResource = Resource.registerResource;

export default RemoteResource;
