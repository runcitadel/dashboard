import {defineStore} from 'pinia';
import type {app as appType, Dependency} from '@runcitadel/sdk';

import useSdkStore from './sdk';

type MetadataV4 = {
  /**
   * The category for the app
   */
  category: string;
  /**
   * The app's default password. Can also be $APP_SEED for a random password
   */
  defaultPassword?: string | undefined;
  developers: Record<string, string>;
  /**
   * A list of promo images for the apps
   */
  gallery?: string[] | undefined;
  /**
   * The name of the app
   */
  name: string;
  /**
   * The path the "Open" link on the dashboard should lead to
   */
  path?: string | undefined;
  /**
   * Permissions the app requires
   */
  permissions?: Array<string | string[]>;
  /**
   * App repository name -> repo URL
   */
  repo: Record<string, string>;
  /**
   * A support link for the app
   */
  support: string;
  /**
   * A short tagline for the app
   */
  tagline: string;
  /**
   * True if the app only works over Tor
   */
  torOnly?: boolean;
  /**
   * A list of containers to update automatically (still validated by the Citadel team)
   */
  updateContainers?: string[] | undefined;
  /**
   * The version of the app
   */
  version: string;
  /** Automatically added */
  hiddenService?: string;
  /** Automatically added */
  installed?: boolean;
  /** Automatically added */
  compatible: boolean;
};

export type app = appType & {
  id: string;
  port: number;
  dependencies: (Dependency | Dependency[])[];
  description?: string;
  developer: string;
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
        this.store = (apps as app[]).map((app) => {
          if ((app as MetadataV4).permissions) {
            app.dependencies = (app as MetadataV4).permissions as (
              | Dependency
              | Dependency[]
            )[];
          }
          return app;
        });
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
