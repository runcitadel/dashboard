import router from "../../router/index.js";
import type { Module } from "vuex";
import type { RootState } from "../index";

export interface State {
  name: string;
  jwt: string;
  registered: boolean;
  totpKey: string;
  totpEnabled: boolean;
  totpAuthenticated: boolean;
  seed: string[];
  installedApps: string[];
}

// Initial state
const userModule: Module<State, RootState> = {
  state: {
    name: "",
    jwt: window.localStorage.getItem("jwt") || "",
    registered: true,
    totpKey: "",
    totpEnabled: false,
    totpAuthenticated: false,
    seed: [],
    installedApps: [],
  },

  // Functions to update the state directly
  mutations: {
    setRegistered(state, registered) {
      state.registered = registered;
    },
    setName(state, name) {
      state.name = name;
    },
    setInstalledApps(state, installedApps) {
      state.installedApps = installedApps;
    },
    setTotpKey(state, totpKey) {
      state.totpKey = totpKey;
    },
    setTotpEnabled(state, totpEnabled) {
      state.totpEnabled = totpEnabled;
    },
    setTotpAuthenticated(state, totpAuthenticated) {
      state.totpAuthenticated = totpAuthenticated;
    },
    setSeed(state, seed) {
      state.seed = seed;
    },
  },

  // Functions to get data from the API
  actions: {
    async login({ commit, rootState }, { password, totpToken }) {
      const jwt = await rootState.citadel.manager.auth.login(
        password,
        totpToken
      );
      if (jwt) {
        commit("setJWT", jwt, { root: true });
      }
    },

    logout({ commit, state }) {
      if (state.jwt) {
        commit("setJWT", "", { root: true });
        router.push("/");
      }
    },

    async refreshJWT({ commit, rootState }) {
      const jwt = await rootState.citadel.manager.auth.refresh();
      if (jwt) {
        commit("setJWT", jwt, { root: true });
      }
    },

    async registered({ commit, rootState }) {
      const registered = await rootState.citadel.manager.auth.isRegistered();
      commit("setRegistered", registered);
    },

    async getInfo({ commit, rootState }) {
      const { name, installedApps } =
        await rootState.citadel.manager.auth.info();
      commit("setName", name);
      commit("setInstalledApps", installedApps);
    },

    async getTotpKey({ commit, rootState }) {
      const totpKey = await rootState.citadel.manager.auth.setupTotp();
      commit("setTotpKey", totpKey);
    },

    async getTotpEnabledStatus({ commit, rootState }) {
      const totpEnabled = await rootState.citadel.manager.auth.isTotpEnabled();
      commit("setTotpEnabled", totpEnabled);
    },

    async getSeed({ commit, state, dispatch, rootState }, plainTextPassword) {
      let rawSeed: string[];

      //first check if user is registered or not
      await dispatch("registered");

      //get user's stored seed if already registered
      if (state.registered && plainTextPassword) {
        rawSeed = await rootState.citadel.manager.auth.seed(plainTextPassword);
      } else {
        //get a new seed if new user
        rawSeed = await rootState.citadel.middleware.lnd.wallet.generatSeed();
      }

      if (rawSeed) {
        commit("setSeed", rawSeed);
      }
    },

    async register({ commit, state, rootState }, { password, seed }) {
      if (!state.registered) {
        const jwt = await rootState.citadel.manager.auth.register(
          password,
          seed
        );

        if (jwt) {
          commit("setJWT", jwt, { root: true });
          commit("setRegistered", true);
          commit("setSeed", []); //remove seed from store
        }
      }
    },
  },
  getters: {},
};

export default {
  namespaced: true,
  ...userModule
};

