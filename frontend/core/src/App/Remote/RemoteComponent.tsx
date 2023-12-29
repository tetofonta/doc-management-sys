import { RemoteComponentLoader } from "@dms/remote-component";
import { useRemoteComponentsContext } from "./remoteComponentsContext";
import React from "react";
import { Loading } from "react-admin";
import { MessageBox, MessageDialogType } from "../MessageBox/MessageBox";

export type RemoteComponentErrorProps = {
    use_short_error?: boolean;
    message: string;
};
export type RemoteComponentProps = {
    component_id: string;
    error?: (msg: string) => React.JSX.Element;
    load?: React.JSX.Element;
    [k: string]: any;
    use_short_error?: boolean;
};

export const RemoteComponent = ({ component_id, error, load, use_short_error, ...oth }: RemoteComponentProps) => {
    const components = useRemoteComponentsContext();

    const err_msg = `The required component id cannot be found (${component_id})`;
    if (!components[component_id])
        return error ? (
            error(err_msg)
        ) : (
            <MessageBox small={use_short_error} title={"Loading error"} message={err_msg} type={MessageDialogType.ERROR} />
        );

    return (
        <RemoteComponentLoader
            component_id={component_id}
            component_manifest={components[component_id]}
            load={load || <Loading />}
            error={
                error ||
                ((m: string) => (
                    <MessageBox small={use_short_error} title={"Loading error"} message={m} type={MessageDialogType.ERROR} />
                ))
            }
            {...oth}
        />
    );
};
