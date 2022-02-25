import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(() => {
  // check if we're running in a container
  const isDocker = process.env.PROJECT_CWD === "/app";
  const remoteServer = {
    host: true,
    port: process.env.PORT,
    hmr: {
      host: process.env.DEVICE_HOSTNAME,
      port: 80,
    },
    watch: {
      usePolling: true
    }
  };

  return {
    // only configure server if in container
    ...(isDocker && { server: remoteServer }),
    build: { target: "esnext" },
    resolve: { alias: { "@": "/src", vue: "@vue/compat" } },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            compatConfig: {
              MODE: 3,
            },
          },
        },
      }),
    ],
  };
});
