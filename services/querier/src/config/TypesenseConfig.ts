import { LoadConfig } from '@dms/config';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

@LoadConfig('indexing')
export class TypesenseConfig {
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    public readonly url: string;

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    public readonly api_key: string;

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    public readonly metadata_collection: string = 'metadata';

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    public readonly tag_collection: string = 'tag';

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    public readonly content_collection: string = 'content';

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    public readonly association_collection: string = 'association';
}
