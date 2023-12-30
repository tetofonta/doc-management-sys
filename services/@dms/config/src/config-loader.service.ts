import { Inject, Injectable, Logger, ValidationError } from '@nestjs/common';
import { ConfigLoaderSettings } from './config/ConfigLoaderSettings';
import { Config } from './config/Config';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { deepAssign, deflatten, validationErrorToString } from './utils';
import { validate } from 'class-validator';

@Injectable()
export class ConfigLoaderService {
    private readonly logger = new Logger('ConfigLoader');
    private readonly configCache: { [k: string]: unknown } = {};

    constructor(
        @Inject('CONFIG')
        private readonly config: ConfigLoaderSettings
    ) {}

    public async load(config: Config): Promise<unknown> {
        const namespace = config.namespace;
        this.logger.log(`Loading settings for ${namespace}`);

        //try from cache
        if (this.configCache[namespace]) return this.configCache[namespace];

        //try main config file
        const main_file_path = this.config.configFile;
        this.logger.debug(`Trying file ${main_file_path}`);
        if (fs.existsSync(main_file_path)) {
            try {
                const data = yaml.load(fs.readFileSync(main_file_path, { encoding: 'utf-8' }));
                if (data[namespace]) {
                    const obj = await this.load_yaml(namespace, config.refClass, data[namespace]);
                    this.configCache[namespace] = obj;
                    return obj;
                }
                this.logger.debug('No data present under the namespace object!');
            } catch (e) {
                this.logger.debug(
                    `Cannot load settings from general file because of the following exception: ${e.message}`
                );
            }
        } else this.logger.debug('File does not exists!');

        //try conf directory
        const main_file_dir = this.config.configDir;
        const file = path.resolve(main_file_dir, namespace + '.yaml');
        this.logger.debug(`Trying file ${file}`);
        if (fs.existsSync(file)) {
            try {
                const data = yaml.load(fs.readFileSync(file, { encoding: 'utf-8' }));
                if (!!data) {
                    const obj = await this.load_yaml(namespace, config.refClass, data);
                    this.configCache[namespace] = obj;
                    return obj;
                }
                this.logger.debug('No data present under the object!');
            } catch (e) {
                this.logger.debug(
                    `Cannot load settings from general file because of the following exception: ${e.message}`
                );
            }
        } else this.logger.debug('File does not exists!');

        if (!config.required) {
            const obj = await this.load_yaml(namespace, config.refClass, {});
            this.configCache[namespace] = obj;
            return obj;
        }

        throw new Error(
            `Config not found for namespace ${namespace}. Please define ${namespace} settings by env variable (${this.config.envVarPrefix(
                namespace
            )}*) or by defining the key \`${namespace}\` in the file ${path.normalize(
                main_file_path
            )} or by defining a file ${path.normalize(
                path.join(main_file_dir, `${namespace}.yaml`)
            )} with the configuration in it.`
        );
    }

    private extract_env_vars(prefix: string) {
        return Object.keys(process.env)
            .filter((e) => e.startsWith(prefix))
            .map((e) => ({
                key: e.replace(new RegExp('^' + prefix, 'g'), '').split(this.config.env_var_separator),
                value: process.env[e],
            }));
    }

    private async load_yaml<T>(namespace: string, clazz: ClassConstructor<T>, object: unknown) {
        //env override
        const keys = this.extract_env_vars(this.config.envVarPrefix(namespace));

        const o = keys.reduce((a, b) => {
            deepAssign(a, deflatten(b.key, b.value));
            this.logger.debug(`Overridden ${b.key.join('.')} = ${b.value}`);
            return a;
        }, object);

        //secret override
        const files = this.extract_env_vars(this.config.secretFilePrefix(namespace));
        const secret_o = files.reduce((a, b) => {
            if (!fs.existsSync(b.value)) {
                this.logger.warn(`Secret file does not exists: ${b.value}`);
                return a;
            }
            deepAssign(a, deflatten(b.key, fs.readFileSync(b.value, { encoding: 'utf-8' }).trim()));
            this.logger.debug(`Overridden ${b.key.join('.')} = FILE(${b.value})`);
            return a;
        }, o);

        //create the class
        const ret = plainToInstance(clazz, secret_o, {
            exposeDefaultValues: true,
            enableImplicitConversion: false,
        });
        const errors: ValidationError[] = await validate(ret as object);

        if (errors.length == 0) return ret;

        this.logger.error(`Validation error!`);
        this.logger.error('==================================\n' + validationErrorToString(errors));
        throw Error('Config load error');
    }
}
