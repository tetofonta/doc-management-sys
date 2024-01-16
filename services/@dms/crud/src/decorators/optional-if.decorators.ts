import { IsOptional } from 'class-validator';

export const OptionalIf = (...groups: string[]) => IsOptional({ groups });
