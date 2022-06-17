import {defineStore} from 'pinia';
import type {app as appType} from '@runcitadel/sdk';

import useSdkStore from './sdk';

export type app = appType & {
  id: string;
};

export interface State {
  installed: app[];
  store: app[];
  installing: string[];
  uninstalling: string[];
  icon?: string;
  sdkStore: ReturnType<typeof useSdkStore>;
}

export default defineStore('apps', {
  // Initial state
  state: (): State => ({
    installed: [],
    store: [],
    installing: [],
    uninstalling: [],
    sdkStore: useSdkStore(),
  }),
  // Functions to get data from the API
  actions: {
    async getInstalledApps() {
      const {apps} = await this.sdkStore.citadel.manager.apps.list(true);
      if (apps) {
        this.installed = apps as app[];
      }
    },
    async getAppStore() {
      this.getInstalledApps();
      const {apps, jwt} = await this.sdkStore.citadel.manager.apps.list();

      // Update JWT
      localStorage.setItem('jwt', jwt);
      this.sdkStore.setJwt(jwt);

      if (apps) {
        this.store = apps as app[];
      }
    },
    async uninstall(appId: string) {
      if (!this.uninstalling.includes(appId)) this.uninstalling.push(appId);
      await this.sdkStore.citadel.manager.apps.uninstall(appId);

      const poll = window.setInterval(async () => {
        await this.getInstalledApps();
        const index = this.installed.findIndex((app) => app?.id === appId);
        if (index === -1) {
          this.uninstalling.splice(this.uninstalling.indexOf(appId), 1);
          window.clearInterval(poll);
        }
      }, 5000);
    },
    async install(appId: string) {
      this.installing.push(appId);
      await this.sdkStore.citadel.manager.apps.install(appId);

      const poll = window.setInterval(async () => {
        await this.getInstalledApps();
        const index = this.installed.findIndex((app) => app?.id === appId);
        if (index !== -1) {
          this.installing.splice(this.installing.indexOf(appId), 1);
          window.clearInterval(poll);
        }
      }, 5000);
    },
    async updateApps() {
      await this.sdkStore.citadel.manager.apps.updateAll();
    },
  },
});
