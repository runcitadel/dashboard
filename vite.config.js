import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(() => {
  // check if we're running in a container
  const isDocker = process.env.PROJECT_CWD === '/app';
  const remoteServer = {
    host: true,
    port: process.env.PORT,
    hmr: {
      // change this if you are not on the default host
      host: process.env.DEVICE_HOSTNAME,
      clientPort: 80,
    },
  };

  return {
    // only configure server if in container
    ...(isDocker && {server: remoteServer}),
    build: {target: 'esnext'},
    resolve: {alias: {'@': '/src', vue: '@vue/compat'}},
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
