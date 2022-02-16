import { Module } from "vuex";
import { RootState } from "..";

/** A dependency an app could have */
type Dependency = "bitcoind" | "electrum" | "lnd";

type app = {
  /** The id of the app, the name as a simple string without spaces */
  id: string;
  /** A category for the app, used for grouping apps on the dashboard */
  category: string;
  /** The name of the app */
  name: string;
  /** The version of the app */
  version: string;
  /** A One line description of the app (max 50 characters) */
  tagline: string;
  /** A longer description of the app (50 to 200 words) */
  description: string;
  /** The person(s) who created the app */
  developer: string;
  /** The url to the app's website */
  website: string;
  /** The dependencies of the app */
  dependencies: Dependency[];
  /** The url to the app's Git repository */
  repo: string;
  /** The url to the app's support website/chat */
  support: string;
  /** The port the app's web UI uses */
  port: number;
  /** A list of links to app promotional images, if no domain is provided, https://runcitadel.github.io/old-apps-gallery/${app.id}/ will be put in front of the path */
  gallery: string[];
  /** The path of the app the open button should open */
  path: string;
  /** The app's default password */
  defaultPassword: string;
  /** Automatically added */
  hiddenService?: string;
  /** Automatically added */
  installed?: boolean;
};

export interface State {
  installed: app[];
  store: app[];
  installing: string[];
  uninstalling: string[];
}
const appModule: Module<State, RootState> = {
  // Initial state
  state: () => ({
    installed: [],
    store: [],
    installing: [],
    uninstalling: [],
  }),

  // Functions to update the state directly
  mutations: {
    setInstalledApps(state, apps: app[]) {
      const alphabeticallySortedApps = apps.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      state.installed = alphabeticallySortedApps;
    },
    setAppStore(state, appStore) {
      state.store = appStore;
    },
    addInstallingApp(state, appId) {
      if (!state.installing.includes(appId)) {
        state.installing.push(appId);
      }
    },
    removeInstallingApp(state, appId) {
      const index = state.installing.findIndex((id) => id === appId);
      if (index !== -1) {
        state.installing.splice(index, 1);
      }
    },
    addUninstallingApp(state, appId) {
      if (!state.uninstalling.includes(appId)) {
        state.uninstalling.push(appId);
      }
    },
    removeUninstallingApp(state, appId) {
      const index = state.uninstalling.findIndex((id) => id === appId);
      if (index !== -1) {
        state.uninstalling.splice(index, 1);
      }
    },
  },

  // Functions to get data from the API
  actions: {
    async getInstalledApps({ commit, rootState }) {
      const installedApps = await rootState.citadel.manager.apps.list(true);
      if (installedApps) {
        commit("setInstalledApps", installedApps);
      }
    },
    async getAppStore({ commit, dispatch, rootState }) {
      dispatch("getInstalledApps");
      const appStore = await rootState.citadel.manager.apps.list();
      if (appStore) {
        commit("setAppStore", appStore);
      }
    },
    async uninstall({ state, commit, dispatch, rootState }, appId) {
      commit("addUninstallingApp", appId);
      await rootState.citadel.manager.apps.uninstall(appId);

      const poll = window.setInterval(async () => {
        await dispatch("getInstalledApps");
        const index = state.installed.findIndex((app) => app.id === appId);
        if (index === -1) {
          commit("removeUninstallingApp", appId);
          window.clearInterval(poll);
        }
      }, 5000);
    },
    async install({ state, commit, dispatch, rootState }, appId) {
      commit("addInstallingApp", appId);
      await rootState.citadel.manager.apps.install(appId);

      const poll = window.setInterval(async () => {
        await dispatch("getInstalledApps");
        const index = state.installed.findIndex((app) => app.id === appId);
        if (index !== -1) {
          commit("removeInstallingApp", appId);
          window.clearInterval(poll);
        }
      }, 5000);
    },
    async updateApps({ rootState }) {
      await rootState.citadel.manager.apps.update();
    },
  },
  getters: {},
};

export default {
  namespaced: true,
  ...appModule,
};
