import { RemoteRaComponentBase } from "@dms/remote-component";
import { Component } from './Component';
import * as pkg from "../package.json"

export class AuthBasicGroupList extends RemoteRaComponentBase{
    constructor() {
        super(Component, pkg.name);
    }

}

customElements.define(pkg.name, AuthBasicGroupList);