import { Module } from "vuex";
import { RootState } from "..";

export interface State {
  version: string;
  availableUpdate: {
    version: string;
    name: string;
    notes: string;
  };
  updateStatus: {
    state:
      | ""
      | "available"
      | "unavailable"
      | "installing"
      | "successful"
      | "failed";
    progress: number;
    description: string;
  };
  backupStatus: {
    status: "" | "success" | "failed";
    timestamp: null;
  };
  debugResult: {
    status: "" | "success" | "processing";
    result: string;
  };
  showUpdateConfirmationModal: false;
  loading: true;
  rebooting: false;
  hasRebooted: false;
  shuttingDown: false;
  hasShutdown: false;
  unit: "sats" | "btc";
  api: {
    operational: false;
    version: string;
  };
  managerApi: {
    operational: false;
    version: string;
  };
  onionAddress: string;
  storage: {
    total: number;
    used: number;
    breakdown: [];
  };
  ram: {
    total: number;
    used: number;
    breakdown: [];
  };
  isCitadelOS: false;
  cpuTemperature: number;
  cpuTemperatureUnit: "celsius" | "fahrenheit";
  uptime: null;
}

const systemModule: Module<State, RootState> = {
  // Initial state
  state: {
    version: "",
    availableUpdate: {
      version: "", //update version available to download
      name: "",
      notes: "",
    },
    updateStatus: {
      state: "", //available, unavailable, installing, successful, failed
      progress: 0, //progress of update installation
      description: "",
    },
    backupStatus: {
      status: "", //success, failed
      timestamp: null,
    },
    debugResult: {
      status: "", //success, processing
      result: "",
    },
    showUpdateConfirmationModal: false,
    loading: true,
    rebooting: false,
    hasRebooted: false,
    shuttingDown: false,
    hasShutdown: false,
    unit: "sats", //sats or btc
    api: {
      operational: false,
      version: "",
    },
    managerApi: {
      operational: false,
      version: "",
    },
    onionAddress: "",
    storage: {
      total: 0,
      used: 0,
      breakdown: [],
    },
    ram: {
      total: 0,
      used: 0,
      breakdown: [],
    },
    isCitadelOS: false,
    cpuTemperature: 0, //in celsius
    cpuTemperatureUnit: "celsius",
    uptime: null,
  },
  mutations: {
    setVersion(state, version) {
      state.version = version;
    },
    setUnit(state, unit) {
      state.unit = unit;
    },
    setApi(state, api) {
      state.api = api;
    },
    setManagerApi(state, api) {
      state.managerApi = api;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setRebooting(state, rebooting) {
      state.rebooting = rebooting;
    },
    setHasRebooted(state, hasRebooted) {
      state.hasRebooted = hasRebooted;
    },
    setShuttingDown(state, shuttingDown) {
      state.shuttingDown = shuttingDown;
    },
    setHasShutDown(state, hasShutdown) {
      state.hasShutdown = hasShutdown;
    },
    setOnionAddress(state, address) {
      state.onionAddress = address;
    },
    setAvailableUpdate(state, update) {
      state.availableUpdate = update;
    },
    setUpdateStatus(state, status) {
      state.updateStatus = status;
    },
    setBackupStatus(state, status) {
      state.backupStatus = status;
    },
    setDebugResult(state, result) {
      state.debugResult = result;
    },
    setShowUpdateConfirmationModal(state, show) {
      state.showUpdateConfirmationModal = show;
    },
    setStorage(state, storage) {
      state.storage = storage;
    },
    setRam(state, ram) {
      state.ram = ram;
    },
    setIsCitadelOS(state, isCitadelOS) {
      state.isCitadelOS = isCitadelOS;
    },
    setCpuTemperature(state, cpuTemperature) {
      state.cpuTemperature = cpuTemperature;
    },
    setCpuTemperatureUnit(state, cpuTemperatureUnit) {
      state.cpuTemperatureUnit = cpuTemperatureUnit;
    },
    setUptime(state, uptime) {
      state.uptime = uptime;
    },
  },
  actions: {
    async getVersion({ commit, rootState }) {
      const data = await rootState.citadel.manager.system.info();
      if (data && data.version) {
        let { version } = data;
        commit("setVersion", version);
      }
    },
    async getUnit({ commit }) {
      if (window.localStorage && window.localStorage.getItem("unit")) {
        commit("setUnit", window.localStorage.getItem("unit"));
      }
    },
    changeUnit({ commit }, unit) {
      if (unit === "sats" || unit === "btc") {
        window.localStorage.setItem("unit", unit);
        commit("setUnit", unit);
      }
    },
    /*async getApi({ commit, rootState }) {
    const api = await API.get(`${import.meta.env.VITE_APP_MIDDLEWARE_API_URL}/ping`);
    commit("setApi", {
      operational: !!(api && api.version),
      version: api && api.version ? api.version : "",
    });
  },*/
    async getManagerApi({ commit, rootState }) {
      const api = await rootState.citadel.manager.ping();
      commit("setManagerApi", {
        operational: !!(api && api.version),
        version: api && api.version ? api.version : "",
      });
    },
    async getOnionAddress({ commit, rootState }) {
      const address = await rootState.citadel.manager.system.getHiddenServiceUrl();
      commit("setOnionAddress", address);
    },
    async getAvailableUpdate({ commit, rootState }) {
      const update = await await rootState.citadel.manager.system.getUpdate();
      if (update && update.version) {
        commit("setAvailableUpdate", update);
      } else {
        commit("setAvailableUpdate", {
          version: "",
          name: "",
          notes: "",
        });
      }
    },
    hideUpdateConfirmationModal({ commit }) {
      commit("setShowUpdateConfirmationModal", false);
    },
    confirmUpdate({ commit }) {
      commit("setShowUpdateConfirmationModal", true);
    },
    async getUpdateStatus({ commit, rootState }) {
      const status = await rootState.citadel.manager.system.updateStatus();
      if (status && status.progress) {
        commit("setUpdateStatus", status);
      }
    },
    async getBackupStatus({ commit, rootState }) {
      const status = await rootState.citadel.manager.system.backupStatus();
      if (status && status.timestamp) {
        commit("setBackupStatus", status);
      }
    },
    async getDebugResult({ commit, rootState }) {
      const result = await rootState.citadel.manager.system.debugResult();
      if (!result) {
        throw new Error("Get debug request failed");
      }

      commit("setDebugResult", result);
    },
    async debug({ commit, rootState }) {
      await rootState.citadel.manager.system.debug();

      commit("setDebugResult", 'Debug requested');
    },
    async shutdown({ commit, rootState }) {
      // Reset any cached hasShutdown value from previous shutdown
      commit("setHasShutDown", false);

      // Shutting down
      await rootState.citadel.manager.system.shutdown();

      commit("setShuttingDown", true);

      // Poll to check if system has shut down
      const pollIfDown = window.setInterval(async () => {
        try {
          const { version } = await rootState.citadel.manager.ping();
          if (!version) {
            // System shut down succesfully
            window.clearInterval(pollIfDown);
            // Optimistically give another 30s to the system to shut down
            return window.setTimeout(() => {
              commit("setShuttingDown", false);
              commit("setHasShutDown", true);
            }, 30 * 1000);
          }
        } catch {
          // System shut down succesfully
          window.clearInterval(pollIfDown);
          // Optimistically give another 30s to the system to shut down
          return window.setTimeout(() => {
            commit("setShuttingDown", false);
            commit("setHasShutDown", true);
          }, 30 * 1000);
        }
      }, 2000);
    },
    async reboot({ commit, rootState }) {
      // Reset any cached hasRebooted value from previous reboot
      commit("setHasRebooted", false);

      // Rebooting
      await rootState.citadel.manager.system.reboot();

      commit("setRebooting", true);

      let pollIfUp: number;

      const pollIfUpFuntion = async () => {
        const { version } = await rootState.citadel.manager.ping();
        if (version) {
          // System is online again
          commit("setRebooting", false);
          commit("setHasRebooted", true);
          return window.clearInterval(pollIfUp);
        }
      };
      // Poll to check if system has shut down
      const pollIfDown = window.setInterval(async () => {
        try {
          const { version } = await rootState.citadel.manager.ping();
          if (!version) {
            // System shut down succesfully
            window.clearInterval(pollIfDown);

            // Now we'll poll to check if it's up
            pollIfUp = window.setInterval(pollIfUpFuntion, 2000);
            return;
          }
        } catch {
          pollIfUp = window.setInterval(pollIfUpFuntion, 2000);
        }
      }, 2000);
    },
    async getStorage({ commit, rootState }) {
      const storage = await await rootState.citadel.manager.system.storage();
      if (storage && storage.total) {
        storage.breakdown.sort((app1, app2) => app2.used - app1.used);
        commit("setStorage", storage);
      }
    },
    async getRam({ commit, rootState }) {
      const ram = await rootState.citadel.manager.system.memory();
      if (ram && ram.total) {
        ram.breakdown.sort((app1, app2) => app2.used - app1.used);
        commit("setRam", ram);
      }
    },
    async getIsCitadelOS({ commit, rootState }) {
      const isCitadelOS = await rootState.citadel.manager.system.isCitadelOS();
      commit("setIsCitadelOS", isCitadelOS);
    },
    async getCpuTemperature({ commit, rootState }) {
      const cpuTemperature = await rootState.citadel.manager.system.temperature();
      if (cpuTemperature) {
        commit("setCpuTemperature", cpuTemperature);
      }
    },
    async getCpuTemperatureUnit({ commit }) {
      if (
        window.localStorage &&
        window.localStorage.getItem("cpuTemperatureUnit")
      ) {
        commit(
          "setCpuTemperatureUnit",
          window.localStorage.getItem("cpuTemperatureUnit")
        );
      }
    },
    changeCpuTemperatureUnit({ commit }, unit) {
      if (unit === "celsius" || unit === "fahrenheit") {
        window.localStorage.setItem("cpuTemperatureUnit", unit);
        commit("setCpuTemperatureUnit", unit);
      }
    },
    async getUptime({ commit, rootState }) {
      const uptime = await rootState.citadel.manager.system.uptime()
      if (uptime) {
        commit("setUptime", uptime);
      }
    },
  },
  getters: {},
};

export default {
  namespaced: true,
  ...systemModule
};
