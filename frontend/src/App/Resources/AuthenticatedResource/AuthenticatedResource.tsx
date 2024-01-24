import { Resource, ResourceProps, useAuthProvider } from "react-admin";
import { ApplicationAuthProvider } from "../../../providers/auth/authProvider";
import { MessageBox, MessageDialogType } from "../../MessageBox/MessageBox";
import { FeatureSet } from "../../../providers/auth/Feature";
import React from "react";

export type AuthenticatedResourceProps = ResourceProps & {
    requiredFeatures?: FeatureSet<string>[];
    requiredListFeatures?: FeatureSet<string>[];
    requiredShowFeatures?: FeatureSet<string>[];
    requiredEditFeatures?: FeatureSet<string>[];
    requiredDeleteFeatures?: FeatureSet<string>[];
    requiredCreateFeatures?: FeatureSet<string>[];
    resourceComponent?: React.FunctionComponent<ResourceProps>;
};
const AuthenticatedResource = function (props: AuthenticatedResourceProps) {
    const {
        requiredFeatures,
        requiredListFeatures,
        requiredDeleteFeatures,
        requiredCreateFeatures,
        requiredEditFeatures,
        requiredShowFeatures,
        ...oth
    } = props;
    const auth = useAuthProvider();

    if (
        !auth.hasPermissions(
            ...(requiredFeatures || [
                ...(requiredListFeatures || []),
                ...(requiredDeleteFeatures || []),
                ...(requiredEditFeatures || []),
                ...(requiredShowFeatures || []),
                ...(requiredCreateFeatures || []),
            ]),
        )
    ) {
        return (
            <MessageBox
                title={"Permission error"}
                message={"You do not have enough permissions to access this resource"}
                type={MessageDialogType.ERROR}
            />
        );
    }
    return !props.resourceComponent ? <Resource {...oth} /> : React.createElement(props.resourceComponent, props);
};

AuthenticatedResource.raName = "Resource";
AuthenticatedResource.registerResource = (props: AuthenticatedResourceProps) => {
    const listAccess = ApplicationAuthProvider.getInstance().hasPermissions(...(props.requiredListFeatures || []));
    const showAccess = ApplicationAuthProvider.getInstance().hasPermissions(...(props.requiredShowFeatures || []));
    const editAccess = ApplicationAuthProvider.getInstance().hasPermissions(...(props.requiredEditFeatures || []));
    const createAccess = ApplicationAuthProvider.getInstance().hasPermissions(...(props.requiredCreateFeatures || []));
    const deleteAccess = ApplicationAuthProvider.getInstance().hasPermissions(...(props.requiredDeleteFeatures || []));
    const access = ApplicationAuthProvider.getInstance().hasPermissions(...(props.requiredFeatures || []));
    console.log("access", access);

    return {
        name: props.name,
        options: props.options,
        hasList: access && listAccess && !!props.list,
        hasCreate: access && createAccess && (!!props.create || !!props.hasCreate),
        hasEdit: access && editAccess && (!!props.edit || !!props.hasEdit),
        hasShow: access && showAccess && (!!props.show || !!props.hasShow),
        hasDelete: access && deleteAccess,
        icon: props.icon,
        recordRepresentation: access ? props.recordRepresentation : undefined,
    };
};

export default AuthenticatedResource;
