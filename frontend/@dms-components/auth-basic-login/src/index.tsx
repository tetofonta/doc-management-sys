import { RemoteElementBase } from '@dms/remote-component';
import { Component } from './Component';
import * as pkg from "../package.json"

export class AuthBasicLogin extends RemoteElementBase{
    constructor() {
        super(Component as any, pkg.name);
    }

}

customElements.define(pkg.name, AuthBasicLogin);