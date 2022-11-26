import {defineStore, acceptHMRUpdate} from 'pinia';
import type {app} from '@runcitadel/sdk-next';

import useSdkStore from './sdk';

export interface State {
  installed: app[];
  store: app[];
  installing: string[];
  uninstalling: string[];
  icon?: string;
  hasElectrum: boolean;
}

const useAppsStore = defineStore('apps', {
  // Initial state
  state: (): State => ({
    installed: [],
    store: [],
    installing: [],
    uninstalling: [],
    hasElectrum: false,
  }),
  // Functions to get data from the API
  actions: {
    async getInstalledApps() {
      const sdkStore = useSdkStore();
      const {apps} = await sdkStore.citadel.apps.list(true);
      if (apps) {
        this.installed = apps as app[];
      }
    },
    async getAppStore() {
      const sdkStore = useSdkStore();
      this.getInstalledApps();
      const {apps, jwt} = await sdkStore.citadel.apps.list();

      // Update JWT
      localStorage.setItem('jwt', jwt);
      sdkStore.setJwt(jwt);

      if (apps) {
        this.store = apps;
      }
    },
    async uninstall(appId: string) {
      const sdkStore = useSdkStore();
      // Last layer of safety
      if (['lnd', 'core-ln', 'bitcoin-core', 'bitcoin-knots'].includes(appId)) {
        alert('This app can not be uninstalled currently');
        return;
      }
      if (!this.uninstalling.includes(appId)) this.uninstalling.push(appId);
      await sdkStore.citadel.apps.uninstall(appId);

      const poll = window.setInterval(async () => {
        await this.getInstalledApps();
        const index = this.installed.findIndex((app) => app.id === appId);
        if (index === -1) {
          this.uninstalling.splice(this.uninstalling.indexOf(appId), 1);
          window.clearInterval(poll);
        }
      }, 5000);
    },
    async install(appId: string) {
      const sdkStore = useSdkStore();
      this.installing.push(appId);
      await sdkStore.citadel.apps.install(appId);

      const poll = window.setInterval(async () => {
        await this.getInstalledApps();
        const index = this.installed.findIndex((app) => app.id === appId);
        if (index !== -1) {
          this.installing.splice(this.installing.indexOf(appId), 1);
          window.clearInterval(poll);
        }
      }, 5000);
    },
    async updateApps() {
      const sdkStore = useSdkStore();
      await sdkStore.citadel.apps.updateAll();
    },
    async getHasElectrum() {
      if (this.store?.length < 1) {
        await this.getAppStore();
      }
      if (this.installed?.length < 1) {
        await this.getInstalledApps();
      }
      const appsThatImplementElectrum = this.store.filter(
        (elem) => elem.implements === 'electrum',
      );
      const installedIds = this.installed.map((elem) => elem.id);
      const installed = [...installedIds, ...this.installing];
      const electrumImplementation = appsThatImplementElectrum.find((elem) =>
        installed.includes(elem.id),
      );
      if (electrumImplementation) {
        this.hasElectrum = true;
      }
    },
  },
});

export default useAppsStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppsStore, import.meta.hot));
}
