/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { SharingContexts } from './context_sharing';
import { ThemeProvider } from 'react-admin';

export type AdminMockupComponentType = {
    context_data: any[];
    component: React.FunctionComponent<any>;
    client: QueryClient;
    [k: string]: any;
};

const AdminContextMockup = (props: AdminMockupComponentType) => {
    const { context_data, component, ...oth } = props;

    let elm = <ThemeProvider>{React.createElement(component, oth)}</ThemeProvider>;
    for (let i = 0, len = Math.min(SharingContexts.length, context_data.length); i < len; i++) {
        const context = SharingContexts[i];
        if (!context) continue;
        elm = React.createElement(context.Provider, {
            value: context_data[i],
            children: [elm],
        });
    }

    return <QueryClientProvider client={props.client}>{elm}</QueryClientProvider>;
};

export default AdminContextMockup;
