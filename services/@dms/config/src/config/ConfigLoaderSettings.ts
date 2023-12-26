import { IsDefined, IsNotEmpty, IsString, validateSync } from 'class-validator';
import { Configurable } from './Config';
import { plainToInstance } from 'class-transformer';
import { validationErrorToString } from '../utils';
import * as path from 'path';

export class ConfigLoaderSettings {
    @IsString()
    @IsDefined()
    @IsNotEmpty()
    public env_var_prefix: string = 'DMS_';

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    public env_var_secret_file_prefix: string = 'DMS_SECRET_FILE_';

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    public default_config_file: string = 'dms-config.yaml';

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    public default_config_dir: string = 'dms.d';

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    public env_config_file_variable_name: string = 'CONFIG_FILE';

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    public env_config_dir_variable_name: string = 'CONFIG_DIR';

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    public env_var_separator: string = '__';
    public global_namespace_load: Configurable[] = [];

    public get configFile() {
        const configDirEnvName = `${this.env_var_prefix}${this.env_config_file_variable_name}`;
        return process.env[configDirEnvName] || path.resolve(process.cwd(), this.default_config_file);
    }

    public get configDir() {
        const configFileEnvName = `${this.env_var_prefix}${this.env_config_dir_variable_name}`;
        return process.env[configFileEnvName] || path.resolve(process.cwd(), this.default_config_dir);
    }

    public static fromObject(obj: Partial<ConfigLoaderSettings>): ConfigLoaderSettings {
        const instance = plainToInstance(ConfigLoaderSettings, obj);
        const valid = validateSync(instance);
        if (valid.length == 0) return instance;

        throw new Error(validationErrorToString(valid));
    }

    public envVarPrefix(namespace) {
        return `${this.env_var_prefix}${namespace}${this.env_var_separator}`;
    }

    public secretFilePrefix(namespace) {
        return `${this.env_var_secret_file_prefix}${namespace}${this.env_var_separator}`;
    }
}
