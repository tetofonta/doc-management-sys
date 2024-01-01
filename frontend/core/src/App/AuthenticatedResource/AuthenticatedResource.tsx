import { Resource, ResourceProps, useAuthProvider } from "react-admin";
import { ApplicationAuthProvider } from "../../providers/auth/authProvider";
import { MessageBox, MessageDialogType } from "../MessageBox/MessageBox";
import { FeatureSet } from "../../providers/auth/Feature";

export type AuthenticatedResourceType = ResourceProps & {
    requiredFeatures: FeatureSet<string>[];
};
const AuthenticatedResource = function (props: AuthenticatedResourceType) {
    const { requiredFeatures, ...oth } = props;
    const auth = useAuthProvider();

    if (!auth.hasPermissions(...requiredFeatures)) {
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
    const access = ApplicationAuthProvider.getInstance().hasPermissions(...props.requiredFeatures);
    console.log("access", access);

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
