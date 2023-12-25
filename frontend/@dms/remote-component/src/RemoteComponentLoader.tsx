import React, { useState } from 'react';

export type TestCreateRemoteProps = {
    component_id: string;
    component_url: string;
    always_load?: boolean;
    load?: React.ReactElement;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    [k: string]: any;
} & HTMLScriptElement;

export const TestCreateRemote = (props: TestCreateRemoteProps) => {
    const { component_id, always_load, component_url, load, ...oth } = props;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const lib_ref = (window as any)[component_id];
    const [loaded, setLoaded] = useState(!!lib_ref);

    if (!lib_ref || always_load) {
        if (always_load) document.getElementById(`__remote_component_${component_id}`)?.remove();

        const elm = document.createElement('script');
        Object.assign(elm, oth);

        elm.src = component_url;
        elm.id = component_id;
        elm.type = 'text/javascript';

        elm.addEventListener('load', () => {
            setLoaded(true);
        });

        document.body.appendChild(elm);
    }

    if (!loaded) return load || <></>;

    return React.createElement(component_id, oth);
};
