import { Resource, ResourceProps } from "react-admin";
import * as React from "react";

const RemoteResource = (props: ResourceProps) => {
    return <Resource {...props} />;
};

RemoteResource.raName = "Resource";
RemoteResource.registerResource = Resource.registerResource;

export default RemoteResource;
