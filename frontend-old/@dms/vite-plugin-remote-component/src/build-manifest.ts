import * as path from 'path';
import * as nodeCrypto from 'crypto';
import * as fs from 'fs';

export type ManifestFileDescriptorType = {
    index: string;
    integrity: string;
};

export type ManifestDescriptorType = {
    main: ManifestFileDescriptorType;
    style: ManifestFileDescriptorType[];
};

export type ManifestType = {
    [k: string]: ManifestDescriptorType;
};

function file_descriptor(file_path: string, url: string): ManifestFileDescriptorType {
    const hash = nodeCrypto.createHash('sha384').update(fs.readFileSync(file_path)).digest('base64');
    return {
        index: url,
        integrity: process.env.NODE_ENV === 'production' ? `sha384-${hash}` : null,
    };
}

export const buildManifest = (name: string, outDir: string, componentBase: string, base: string) => {
    return {
        name: 'build-manifest',
        closeBundle: async () => {
            const manifest_path = path.join(outDir, 'manifest.json');
            let manifest_data: any = {};
            if (fs.existsSync(manifest_path))
                manifest_data = JSON.parse(fs.readFileSync(manifest_path, { encoding: 'utf-8' }))['index.html'];

            const js_file = manifest_data.file;
            const css_data = manifest_data.css || [];

            const manifest: ManifestDescriptorType = {
                main: file_descriptor(path.join(outDir, js_file), path.join(base, js_file)),
                style: css_data.map((e) => file_descriptor(path.join(outDir, e), path.join(base, e))),
            };

            let plugin_manifest: ManifestType = {};
            const plugin_manifest_path = path.join(componentBase, 'manifest.json');
            if (fs.existsSync(plugin_manifest_path)) {
                plugin_manifest = JSON.parse(fs.readFileSync(plugin_manifest_path, { encoding: 'utf-8' }));
            }
            plugin_manifest[name] = manifest;
            console.log({ [name]: manifest });

            fs.writeFileSync(plugin_manifest_path, JSON.stringify(plugin_manifest, null, 2));
            fs.rmSync(path.join(outDir, 'index.html'));
        },
    };
};
