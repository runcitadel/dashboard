import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
  },
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
});
