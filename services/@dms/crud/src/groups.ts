import { Type } from '@nestjs/common';
import { BaseEntity } from 'typeorm';

export const CRUD_LIST = <T extends BaseEntity>(resource: Type<T>) => `crud_list_${resource.name}`;
export const CRUD_SELECT = <T extends BaseEntity>(resource: Type<T>) => `crud_select_${resource.name}`;
export const CRUD_EDIT = <T extends BaseEntity>(resource: Type<T>) => `crud_edit_${resource.name}`;
export const CRUD_CREATE = <T extends BaseEntity>(resource: Type<T>) => `crud_edit_${resource.name}`;
