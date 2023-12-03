/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "";

export interface TokenPayload {
  userId: string;
  superuser: boolean;
  features: string[];
  groups: string[];
}

function createBaseTokenPayload(): TokenPayload {
  return { userId: "", superuser: false, features: [], groups: [] };
}

export const TokenPayload = {
  encode(message: TokenPayload, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
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

          message.userId = reader.string();
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
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TokenPayload {
    return {
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
      superuser: isSet(object.superuser) ? globalThis.Boolean(object.superuser) : false,
      features: globalThis.Array.isArray(object?.features) ? object.features.map((e: any) => globalThis.String(e)) : [],
      groups: globalThis.Array.isArray(object?.groups) ? object.groups.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: TokenPayload): unknown {
    const obj: any = {};
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.superuser === true) {
      obj.superuser = message.superuser;
    }
    if (message.features?.length) {
      obj.features = message.features;
    }
    if (message.groups?.length) {
      obj.groups = message.groups;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TokenPayload>, I>>(base?: I): TokenPayload {
    return TokenPayload.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TokenPayload>, I>>(object: I): TokenPayload {
    const message = createBaseTokenPayload();
    message.userId = object.userId ?? "";
    message.superuser = object.superuser ?? false;
    message.features = object.features?.map((e) => e) || [];
    message.groups = object.groups?.map((e) => e) || [];
    return message;
  },
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
