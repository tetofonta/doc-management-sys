import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {buildManifest} from "@dms/vite-plugin-remote-component"


// @ts-ignore
import * as pkg from "./package.json"

const base = `/components/${pkg.name}`
const outDir = `../out/components/${pkg.name}/`;
const componentBase = `../out/components/`;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        buildManifest(pkg.name, outDir, componentBase, base)
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
        manifest: true
    },
});
