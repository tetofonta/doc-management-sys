import React from 'react';
import { RemoteElementBase } from './RemoteElementBase';
import AdminContextMockup, { AdminMockupComponentType } from '../Components/RaAdminMockup/RaAdminMockup';

export class RemoteRaComponentBase extends RemoteElementBase {
    protected build_element(props: { [p: string]: unknown }): React.ReactNode {
        return React.createElement(AdminContextMockup, {
            ...(props as unknown as AdminMockupComponentType),
            component: this.component,
            resourceName: props.resourceName as string | undefined,
        });
    }
}
