import { useRemoteComponentsContext } from './remoteComponentsContext';
import React from 'react';

export type RemoteComponentErrorProps = {
    use_short_error?: boo
    lean
}
export type RemoteComponentProps = {
    component_id: string,
    error?: (msg: string) => React.ReactElement,
    load: React.ReactElement,
    [k: string]: any
} & RemoteComponentErrorProps

export const RemoteComponentError = ({use_short_error}: RemoteComponentErrorProps) => {
    return <></>
}

export const RemoteComponent = ({component_id, error, load, ...oth}: RemoteComponentProps) => {
    const components = useRemoteComponentsContext()

    if( !components[component_id] )
        return error ? error(`The required component id cannot be found (${component_id})`) :

}