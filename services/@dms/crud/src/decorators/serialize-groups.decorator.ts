import { SerializeOptions } from '@nestjs/common';
import { BaseEntity } from 'typeorm';

export const SerializeGroups = (...groups: string[]) => SerializeOptions({ groups });
