import { RemoteRaComponentBase } from "@dms/remote-component";
import { Component } from './Component';
import * as pkg from "../package.json"

export class AuthBasicUserCreate extends RemoteRaComponentBase{
    constructor() {
        super(Component, pkg.name);
    }

}

customElements.define(pkg.name, AuthBasicUserCreate);