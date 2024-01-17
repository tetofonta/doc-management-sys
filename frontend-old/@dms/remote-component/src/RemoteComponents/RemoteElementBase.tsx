import React from 'react';
import ReactDOM, { Root } from 'react-dom/client';

export class RemoteElementBase extends HTMLElement {
    public reactRoot!: Root;
    public props: { [k: string]: unknown } = {};
    private mountPoint!: HTMLDivElement;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    constructor(
        protected readonly component: (props: { [k: string]: unknown }) => any,
        private readonly component_id: string
    ) {
        super();
    }

    public connectedCallback() {
        console.debug(`Plugin ${this.component_id} loaded`);

        this.mountPoint = document.createElement('div');
        // const shadowRoot = this.attachShadow({ mode: 'open' });
        this.appendChild(this.mountPoint);

        this.reactRoot = ReactDOM.createRoot(this.mountPoint);
        // retargetEvents(shadowRoot);

        this.dispatchEvent(new Event(`${this.component_id}:loaded`));
    }

    public renderElement() {
        const c = this.build_element(this.props);
        this.reactRoot.render(<React.StrictMode>{c}</React.StrictMode>);
    }

    protected build_element(props: { [k: string]: unknown }): React.ReactNode {
        console.log(props);
        return React.createElement(this.component, props);
    }
}
