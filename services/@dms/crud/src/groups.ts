import { Type } from '@nestjs/common';
import { BaseEntity } from 'typeorm';

export const CRUD_LIST = <T extends BaseEntity>(resource: Type<T> | string) =>
    `crud_list_${typeof resource === 'string' ? resource : resource.name}`;
export const CRUD_SELECT = <T extends BaseEntity>(resource: Type<T> | string) =>
    `crud_select_${typeof resource === 'string' ? resource : resource.name}`;
export const CRUD_EDIT = <T extends BaseEntity>(resource: Type<T> | string) =>
    `crud_edit_${typeof resource === 'string' ? resource : resource.name}`;
export const CRUD_CREATE = <T extends BaseEntity>(resource: Type<T> | string) =>
    `crud_create_${typeof resource === 'string' ? resource : resource.name}`;
