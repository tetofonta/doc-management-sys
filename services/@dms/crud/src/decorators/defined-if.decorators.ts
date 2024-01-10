import { IsDefined } from 'class-validator';

export const DefinedIf = (...groups: string[]) => IsDefined({ groups });
