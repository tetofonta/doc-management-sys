import { RemoteElementBase } from './RemoteElementBase';
import React from 'react';

export class AuthRemoteElement extends RemoteElementBase {
    public perform_login!: (token: string, name: string) => void;
    public previous_identity: { name: string } | null = null;

    protected build_element(props: { [k: string]: unknown }): React.FunctionComponentElement<{ [p: string]: unknown }> {
        return super.build_element({
            ...props,
            perform_login: this.perform_login,
            previous_identity: this.previous_identity,
        });
    }
}
