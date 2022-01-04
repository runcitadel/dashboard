import type { app } from "@runcitadel/sdk/dist/common/types";
import { Module } from "vuex";
import { RootState } from "..";

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
    }
  },
  getters: {},
};

export default {
  namespaced: true,
  ...appModule
};
