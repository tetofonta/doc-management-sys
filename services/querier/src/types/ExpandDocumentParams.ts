import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';

export class ExpandDocumentParams {
    @IsUUID()
    @IsNotEmpty()
    @IsDefined()
    public readonly id: string;
}
