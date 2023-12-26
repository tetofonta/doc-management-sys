import React from 'react';
import ReactDOM, { Root } from 'react-dom/client';
import retargetEvents from 'react-shadow-dom-retarget-events';

export class RemoteElementBase extends HTMLElement {
    public reactRoot!: Root;
    public props: { [k: string]: unknown } = {};
    private mountPoint!: HTMLDivElement;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    constructor(
        private readonly component: (props: { [k: string]: unknown }) => any,
        private readonly component_id: string
    ) {
        super();
    }

    public connectedCallback() {
        console.debug(`Plugin ${this.component_id} loaded`);
        this.mountPoint = document.createElement('div');

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(this.mountPoint);

        this.reactRoot = ReactDOM.createRoot(shadowRoot);
        retargetEvents(shadowRoot);

        this.dispatchEvent(new Event(`${this.component_id}:loaded`));
    }

    protected build_element(props: { [k: string]: unknown }) {
        console.log(props);
        return React.createElement(this.component, props);
    }

    public renderElement() {
        const c = this.build_element(this.props);
        this.reactRoot.render(<React.StrictMode>{c}</React.StrictMode>);
    }
}
