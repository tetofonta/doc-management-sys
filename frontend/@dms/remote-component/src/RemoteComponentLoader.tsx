import React, { useEffect, useState } from 'react';
import { RemoteElementBase } from './RemoteComponents/RemoteElementBase';

export type RemoteComponentDescriptor = {
    main: { index: string; integrity: string };
    style: { index: string; integrity: string }[];
};

export type TestCreateRemoteProps = {
    component_id: string;
    component_manifest: RemoteComponentDescriptor;
    always_load?: boolean;
    load?: React.JSX.Element;
    error?: (m: string) => React.JSX.Element;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    [k: string]: any;
} & Partial<HTMLScriptElement>;

export const RemoteComponentLoader = (props: TestCreateRemoteProps) => {
    const { component_id, always_load, component_manifest, load, error, ...oth } = props;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const lib_ref = (window as any)[component_id];
    const [loaded, setLoaded] = useState(!!lib_ref?.loaded);
    const [err, setErr] = useState(!!lib_ref?.error);

    useEffect(() => {
        if (!(window as any)[component_id]?.loaded || always_load) {
            if (always_load) document.getElementById(`__remote_component_${component_id}`)?.remove();

            const elm = document.createElement('script');
            Object.assign(elm, oth);
            elm.src = component_manifest.main.index;
            elm.id = `__remote_component_${component_id}`;
            elm.type = 'module';
            elm.defer = true;
            elm.integrity = component_manifest.main.integrity;

            for (const css of component_manifest.style) {
                const elm = document.createElement('link');
                elm.rel = 'stylesheet';
                elm.href = css.index;
                elm.integrity = css.integrity;
                document.body.appendChild(elm);
            }

            elm.onload = () => {
                setLoaded(true);
            };

            elm.onerror = (e) => {
                setErr(true);
                (window as any)[component_id] = { loaded: true, error: true };
                console.error(e);
            };

            document.body.appendChild(elm);
            (window as any)[component_id] = { loaded: true, error: false };
        }
    }, []);

    if (err) return error ? error('Cannot load script. Check console for additional info') : <></>;
    if (!loaded) return load || <></>;

    return React.createElement(component_id, {
        ref: (el: RemoteElementBase) => {
            try {
                if (el) {
                    if (el.renderElement) {
                        el.props = oth;
                        el.renderElement();
                    } else {
                        const f = () => {
                            el.props = oth;
                            el.renderElement();
                            el.removeEventListener(`${component_id}:loaded`, f);
                        };
                        el.addEventListener(`${component_id}:loaded`, f);
                    }
                }
            } catch (e) {
                setErr(true);
                (window as any)[component_id] = { load: false, error: true, e };
            }
        },
    });
};
