import {defineStore} from 'pinia';
import useSdkStore from './sdk';

/** A dependency an app could have */
export type Dependency = 'bitcoind' | 'electrum' | 'lnd' | 'c-lightning';
/**
 * Defines an app
 */
export type app = {
  /** The id of the app, the name as a simple string without spaces */
  id?: string;
  /** A category for the app, used for grouping apps on the dashboard */
  category: string;
  /** The name of the app */
  name: string;
  /** The version of the app */
  version: string;
  /** A One line description of the app (max 50 characters) */
  tagline: string;
  /** A longer description of the app (50 to 200 words) */
  description?: string;
  /** The person(s) who created the app */
  developer?: string;
  /** The person(s) who created the app */
  developers?: Record<string, string>;
  /** The dependencies of the app */
  dependencies?: (Dependency | Dependency[])[];
  /** The url to the app's Git repository */
  repo: string | Record<string, string>;
  /** The url to the app's support website/chat */
  support: string;
  /** The port the app's web UI uses */
  port?: number;
  /** A list of links to app promotional images, if no domain is provided, https://runcitadel.github.io/old-apps-gallery/${app.id}/ will be put in front of the path */
  gallery?: string[];
  /** The path of the app the open button should open */
  path?: string;
  /** The app's default password */
  defaultPassword?: string;
  torOnly?: boolean;
  /** Automatically added */
  hiddenService?: string;
  /** Automatically added */
  installed?: boolean;
  /** Automatically added */
  compatible: boolean;
  icon?: string;
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
        this.installed = apps;
      }
    },
    async getAppStore() {
      this.getInstalledApps();
      const {apps} = await this.sdkStore.citadel.manager.apps.list();
      if (apps) {
        this.store = apps;
      }
    },
    async uninstall(appId: string) {
      if (!this.uninstalling.includes(appId)) this.uninstalling.push(appId);
      await this.sdkStore.citadel.manager.apps.uninstall(appId);

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
      this.installing.push(appId);
      await this.sdkStore.citadel.manager.apps.install(appId);

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
      await this.sdkStore.citadel.manager.apps.updateAll();
    },
  },
});
