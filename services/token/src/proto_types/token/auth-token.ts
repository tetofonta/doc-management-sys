/* eslint-disable */
import * as _m0 from "protobufjs/minimal";
import { FileDescriptorProto } from "ts-proto-descriptors";

export const protobufPackage = "";

export interface TokenPayload {
  user_id: string;
  superuser: boolean;
  features: string[];
  groups: string[];
  source: string;
}

function createBaseTokenPayload(): TokenPayload {
  return { user_id: "", superuser: false, features: [], groups: [], source: "" };
}

export const TokenPayload = {
  encode(message: TokenPayload, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.user_id !== "") {
      writer.uint32(10).string(message.user_id);
    }
    if (message.superuser === true) {
      writer.uint32(16).bool(message.superuser);
    }
    for (const v of message.features) {
      writer.uint32(26).string(v!);
    }
    for (const v of message.groups) {
      writer.uint32(34).string(v!);
    }
    if (message.source !== "") {
      writer.uint32(42).string(message.source);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TokenPayload {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenPayload();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.user_id = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.superuser = reader.bool();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.features.push(reader.string());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.groups.push(reader.string());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.source = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create<I extends Exact<DeepPartial<TokenPayload>, I>>(base?: I): TokenPayload {
    return TokenPayload.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TokenPayload>, I>>(object: I): TokenPayload {
    const message = createBaseTokenPayload();
    message.user_id = object.user_id ?? "";
    message.superuser = object.superuser ?? false;
    message.features = object.features?.map((e) => e) || [];
    message.groups = object.groups?.map((e) => e) || [];
    message.source = object.source ?? "";
    return message;
  },
};

type ProtoMetaMessageOptions = {
  options?: { [key: string]: any };
  fields?: { [key: string]: { [key: string]: any } };
  oneof?: { [key: string]: { [key: string]: any } };
  nested?: { [key: string]: ProtoMetaMessageOptions };
};

export interface ProtoMetadata {
  fileDescriptor: FileDescriptorProto;
  references: { [key: string]: any };
  dependencies?: ProtoMetadata[];
  options?: {
    options?: { [key: string]: any };
    services?: {
      [key: string]: { options?: { [key: string]: any }; methods?: { [key: string]: { [key: string]: any } } };
    };
    messages?: { [key: string]: ProtoMetaMessageOptions };
    enums?: { [key: string]: { options?: { [key: string]: any }; values?: { [key: string]: { [key: string]: any } } } };
  };
}

export const protoMetadata: ProtoMetadata = {
  fileDescriptor: FileDescriptorProto.fromPartial({
    "name": "token/auth-token.proto",
    "package": "",
    "dependency": [],
    "publicDependency": [],
    "weakDependency": [],
    "messageType": [{
      "name": "TokenPayload",
      "field": [{
        "name": "user_id",
        "number": 1,
        "label": 2,
        "type": 9,
        "typeName": "",
        "extendee": "",
        "defaultValue": "",
        "oneofIndex": 0,
        "jsonName": "userId",
        "options": undefined,
        "proto3Optional": false,
      }, {
        "name": "superuser",
        "number": 2,
        "label": 2,
        "type": 8,
        "typeName": "",
        "extendee": "",
        "defaultValue": "",
        "oneofIndex": 0,
        "jsonName": "superuser",
        "options": undefined,
        "proto3Optional": false,
      }, {
        "name": "features",
        "number": 3,
        "label": 3,
        "type": 9,
        "typeName": "",
        "extendee": "",
        "defaultValue": "",
        "oneofIndex": 0,
        "jsonName": "features",
        "options": undefined,
        "proto3Optional": false,
      }, {
        "name": "groups",
        "number": 4,
        "label": 3,
        "type": 9,
        "typeName": "",
        "extendee": "",
        "defaultValue": "",
        "oneofIndex": 0,
        "jsonName": "groups",
        "options": undefined,
        "proto3Optional": false,
      }, {
        "name": "source",
        "number": 5,
        "label": 2,
        "type": 9,
        "typeName": "",
        "extendee": "",
        "defaultValue": "",
        "oneofIndex": 0,
        "jsonName": "source",
        "options": undefined,
        "proto3Optional": false,
      }],
      "extension": [],
      "nestedType": [],
      "enumType": [],
      "extensionRange": [],
      "oneofDecl": [],
      "options": undefined,
      "reservedRange": [],
      "reservedName": [],
    }],
    "enumType": [],
    "service": [],
    "extension": [],
    "options": undefined,
    "sourceCodeInfo": { "location": [] },
    "syntax": "",
  }),
  references: { ".TokenPayload": TokenPayload },
  dependencies: [],
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };
