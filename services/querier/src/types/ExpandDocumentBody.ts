import { IsArray, IsDefined, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ExpandDocumentBody {
    @IsString({ each: true })
    @IsArray()
    @IsDefined()
    @IsUUID(undefined, { each: true })
    documents: string[];
}
