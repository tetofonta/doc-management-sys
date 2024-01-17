import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import DynamicPublicDirectory from "vite-multiple-assets";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        proxy: {
            "/api": "http://localhost:8080",
            "/components": "http://localhost:8000",
        },
        headers: {
            "Cache-Control": "no-cache, must-revalidate",
        },
    },
    base: "/",
    build: {
        minify: process.env.NODE_ENV == "production",
        sourcemap: process.env.NODE_ENV == "production" ? false : "inline",
        outDir: "../out",
        assetsDir: "assets",
        emptyOutDir: false,
        manifest: true,
    },
});
