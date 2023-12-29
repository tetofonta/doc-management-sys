import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import DynamicPublicDirectory from "vite-multiple-assets";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), DynamicPublicDirectory(["./public", "../out"])],
    server: {
        host: true,
        proxy: {
            "/api": "http://localhost:8080",
        },
    },
    base: "/",
    cacheDir: "./cache",
    build: {
        minify: process.env.NODE_ENV == "production",
        sourcemap: process.env.NODE_ENV == "production" ? false : "inline",
        outDir: "../out",
        assetsDir: "assets",
        emptyOutDir: false,
        manifest: true,
    },
});
