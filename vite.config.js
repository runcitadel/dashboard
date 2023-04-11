import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

import Components from 'unplugin-vue-components/vite';

export default defineConfig(({mode}) => {
  const defaultHost =
    mode === 'development' ? 'citadel-dev.local' : 'citadel.local';
  const host = process.env.DEVICE_HOSTNAME ?? defaultHost;

  // check if we're running in a container
  const isDocker = process.env.PROJECT_CWD === '/app';
  const remoteServer = {
    host: true,
    port: process.env.PORT,
    hmr: {
      host,
      clientPort: 80,
    },
  };

  return {
    // only configure server if in container
    ...(isDocker && {server: remoteServer}),
    build: {target: 'esnext'},
    define: {
      // To be consistent with esbuild behavior, must either be a JSON object (null, boolean, number, string, array, or object) or a single identifier
      __DEVICE_HOSTNAME__: {host},
    },
    resolve: {alias: {'@': '/src'}},
    plugins: [
      vue(),
      Components({
        dirs: [],
        resolvers: [
          [
            {
              type: 'component',
              resolve: (name) => {
                if (name.match(/^B[A-Z]/) && !name.startsWith('BIcon')) {
                  return {name, from: 'bootstrap-vue-next'};
                }
              },
            },
          ],
        ],
      }),
    ],
  };
});
