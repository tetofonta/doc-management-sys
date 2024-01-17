import { Expose } from 'class-transformer';
import { BaseEntity } from 'typeorm';
import { Type } from '@nestjs/common';

export const ExposeIf = (...groups: string[]) => Expose({ groups });
