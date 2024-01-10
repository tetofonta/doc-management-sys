import { SerializeOptions, UsePipes, ValidationPipe } from '@nestjs/common';
import { BaseEntity } from 'typeorm';

export const ValidateGroups = (...groups: string[]) => UsePipes(new ValidationPipe({ transform: true, groups }));
