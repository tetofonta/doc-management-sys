import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import * as nodeCrypto from 'crypto';
import * as fs from 'fs';

// @ts-ignore
import * as pkg from "./package.json"

const base = `/components/${pkg.name}`
const outDir = `../out/components/${pkg.name}/`;
const componentBase = `../out/components/`;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        {
            name: "build-manifest",
            closeBundle: async () => {
                const manifest_path = path.join(outDir, 'manifest.json')
                const index_file = JSON.parse(fs.readFileSync(manifest_path, {encoding: 'utf-8'}))["index.html"].file
                const index_path = path.join(outDir, index_file)

                const hash = nodeCrypto.createHash('sha384').update(fs.readFileSync(index_path, {encoding: 'utf-8'})).digest('base64')

                const manifest = {
                    "index": path.join(base, index_file),
                    "integrity": `sha384-${hash}`
                }

                let plugin_manifest: {[k: string]: {index: string, integrity: string}} = {};
                const plugin_manifest_path = path.join(componentBase, "manifest.json")
                if (fs.existsSync(plugin_manifest_path)){
                    plugin_manifest = JSON.parse(fs.readFileSync(plugin_manifest_path, {encoding: "utf-8"}))
                }
                plugin_manifest[pkg.name] = manifest
                console.log({[pkg.name]: manifest})

                fs.writeFileSync(plugin_manifest_path, JSON.stringify(plugin_manifest, null, 2))
                fs.rmSync(path.join(outDir, 'index.html'))
            }
        }
    ],
    define: {
    },
    server: {
        host: true,
        port: 5173,

    },
    base,
    build: {
        // eslint-disable-next-line no-undef
        minify: process.env.NODE_ENV == 'production',
        // eslint-disable-next-line no-undef
        sourcemap: process.env.NODE_ENV == 'production' ? false : 'inline',
        outDir,
        assetsDir: "",
        emptyOutDir: true,
        manifest: true,
        watch: {
            include: "./src/**/*"
        }
    },
});
