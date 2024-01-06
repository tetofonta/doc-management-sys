/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { SharingContexts } from './context_sharing';
import {
    AuthContext,
    CreateContext,
    DataProviderContext,
    EditContext,
    ListContext,
    ListFilterContext,
    ListPaginationContext,
    ListSortContext,
    RecordContext,
    ResourceDefinitionContext,
    SaveContext,
    ShowContext,
    ThemeProvider,
} from 'react-admin';
import { UNSAFE_LocationContext, UNSAFE_NavigationContext, UNSAFE_RouteContext } from 'react-router';

export type AdminMockupComponentType = {
    context_data: any[];
    component: React.FunctionComponent<any>;
    [k: string]: any;
};

const AdminContextMockup = (props: AdminMockupComponentType) => {
    const { context_data, component, ...oth } = props;

    const QueryClientContext = window.ReactQueryClientContext;
    if (!QueryClientContext) {
        console.error('No queryClient global context found.');
        return;
    }

    const queryClient = useContext(QueryClientContext);

    let elm = <ThemeProvider>{React.createElement(component, oth)}</ThemeProvider>;
    for (let i = 0, len = Math.min(SharingContexts.length, context_data.length); i < len; i++) {
        const context = SharingContexts[i];
        if (!context) continue;
        elm = React.createElement(context.Provider, {
            value: context_data[i],
            children: [elm],
        });
    }

    return <QueryClientProvider client={queryClient || new QueryClient()}>{elm}</QueryClientProvider>;
};

export default AdminContextMockup;
