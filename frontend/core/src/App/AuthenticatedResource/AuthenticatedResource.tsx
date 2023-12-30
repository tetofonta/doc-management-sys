import { Resource, ResourceProps } from "react-admin";
import { ApplicationAuthProvider, FeatureSet } from "../../providers/authProvider";
import { MessageBox, MessageDialogType } from "../MessageBox/MessageBox";

export type AuthenticatedResourceType = ResourceProps & {
    requiredFeatures: FeatureSet<string>[];
};
const AuthenticatedResource = function (props: AuthenticatedResourceType) {
    const { requiredFeatures, ...oth } = props;

    if (!ApplicationAuthProvider.hasPermissions(...requiredFeatures)) {
        return (
            <MessageBox
                title={"Permission error"}
                message={"You do not have enough permissions to access this resource"}
                type={MessageDialogType.ERROR}
            />
        );
    }
    return <Resource {...oth} />;
};

AuthenticatedResource.raName = "Resource";
AuthenticatedResource.registerResource = (props: AuthenticatedResourceType) => {
    const access = ApplicationAuthProvider.hasPermissions(...props.requiredFeatures);
    console.log("access", access)

    return {
        name: props.name,
        options: props.options,
        hasList: access && !!props.list,
        hasCreate: access && (!!props.create || !!props.hasCreate),
        hasEdit: access && (!!props.edit || !!props.hasEdit),
        hasShow: access && (!!props.show || !!props.hasShow),
        icon: props.icon,
        recordRepresentation: access ? props.recordRepresentation : undefined,
    };
};

export default AuthenticatedResource;
