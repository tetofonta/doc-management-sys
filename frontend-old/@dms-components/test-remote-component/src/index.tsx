import { RemoteElementBase } from "@dms/remote-component";
import { Component } from './Component';
import * as pkg from "../package.json"

export class TestComponent extends RemoteElementBase{
    constructor() {
        super(Component, pkg.name);
    }

}

customElements.define(pkg.name, TestComponent);