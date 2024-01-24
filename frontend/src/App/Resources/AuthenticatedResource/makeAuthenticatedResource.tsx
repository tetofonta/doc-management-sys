import AuthenticatedResource, { AuthenticatedResourceProps } from "./AuthenticatedResource";

export const makeAuthenticatedResource = (props: AuthenticatedResourceProps) => {
    const res = () => <AuthenticatedResource {...props} />;
    res.raName = "Resource";
    res.registerResource = AuthenticatedResource.registerResource;
    return res
};
