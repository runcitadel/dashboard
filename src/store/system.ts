import {defineStore, acceptHMRUpdate} from 'pinia';
import useSdkStore from './sdk';

type memBreakdown = {
  id: string;
  used: number;
};

export interface State {
  version: string;
  availableUpdate: {
    version: string;
    name: string;
    notes: string;
  };
  updateStatus: {
    state:
      | ''
      | 'available'
      | 'unavailable'
      | 'installing'
      | 'failed'
      | 'installing'
      | 'success';
    progress: number;
    description: string;
  };
  backupStatus: {
    status: '' | 'success' | 'failed';
    timestamp: null | number;
  };
  debugStatus: {
    status: '' | 'requested' | 'processing' | 'success';
    debug: string | null;
    dmesg: string | null;
  };
  systemStatus: {
    type: '' | 'reboot' | 'shutdown';
    status: '' | 'requested';
  };
  showUpdateConfirmationModal: boolean;
  loading: boolean;
  rebooting: boolean;
  hasRebooted: boolean;
  shuttingDown: boolean;
  hasShutdown: boolean;
  unit: 'sats' | 'btc';
  api: {
    operational: boolean;
    version: string;
  };
  managerApi: {
    operational: boolean;
    version: string;
  };
  onionAddress: string;
  storage: {
    total: number;
    used: number;
    breakdown: memBreakdown[];
  };
  ram: {
    total: number;
    used: number;
    breakdown: memBreakdown[];
  };
  isCitadelOS: boolean;
  cpuTemperature: number;
  cpuTemperatureUnit: 'celsius' | 'fahrenheit';
  uptime: null | number;
  isNvme: boolean;
  // It can be anything, but these are the most likely
  updateChannel: 'stable' | 'beta' | 'c-lightning' | string;
  i2p: {
    username: string;
    password: string;
  };
}

const useSystemStore = defineStore('system', {
  // Initial state
  state: (): State => ({
    version: '',
    availableUpdate: {
      version: '', //update version available to download
      name: '',
      notes: '',
    },
    updateStatus: {
      state: '', //available, unavailable, installing, successful, failed
      progress: 0, //progress of update installation
      description: '',
    },
    backupStatus: {
      status: '', //success, failed
      timestamp: null,
    },
    debugStatus: {
      status: '', //success, processing
      debug: '',
      dmesg: '',
    },
    systemStatus: {
      type: '',
      status: '',
    },
    showUpdateConfirmationModal: false,
    loading: true,
    rebooting: false,
    hasRebooted: false,
    shuttingDown: false,
    hasShutdown: false,
    unit: 'sats', //sats or btc
    api: {
      operational: false,
      version: '',
    },
    managerApi: {
      operational: false,
      version: '',
    },
    onionAddress: '',
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
    cpuTemperatureUnit: 'celsius',
    uptime: null,
    isNvme: false,
    updateChannel: 'stable',
    i2p: {
      username: 'i2pd',
      password: '',
    },
  }),
  actions: {
    async getI2PCredentials() {
      const sdkStore = useSdkStore();
      this.i2p = await sdkStore.citadel.manager.system.i2pCredentials();
    },
    async getVersion() {
      const sdkStore = useSdkStore();
      const data = await sdkStore.citadel.manager.system.info();
      if (data && data.version) {
        const {version} = data;
        this.version = version;
      }
    },
    async getUpdateChannel() {
      const sdkStore = useSdkStore();
      const data = await sdkStore.citadel.manager.system.getUpdateChannel();
      if (data) {
        this.updateChannel = data;
      }
    },
    async setUpdateChannel(channel: string) {
      const sdkStore = useSdkStore();
      await sdkStore.citadel.manager.system.setUpdateChannel(channel);
      this.updateChannel = channel;
    },
    getUnit() {
      if (window.localStorage.getItem('unit')) {
        this.unit = window.localStorage.getItem('unit') as 'sats' | 'btc';
      }
    },
    changeUnit(unit: 'sats' | 'btc') {
      if (unit === 'sats' || unit === 'btc') {
        window.localStorage.setItem('unit', unit);
        this.unit = unit;
      }
    },
    async getManagerApi() {
      const sdkStore = useSdkStore();
      const api = await sdkStore.citadel.manager.ping();
      this.managerApi = {
        operational: !!(api && api.version),
        version: api && api.version ? api.version : '',
      };
    },
    async getOnionAddress() {
      const sdkStore = useSdkStore();
      const address =
        await sdkStore.citadel.manager.system.getHiddenServiceUrl();
      this.onionAddress = address;
    },
    async getAvailableUpdate() {
      const sdkStore = useSdkStore();
      const update = await sdkStore.citadel.manager.system.getUpdate();
      if (update && update.version) {
        this.availableUpdate = update;
      } else {
        this.availableUpdate = {
          version: '',
          name: '',
          notes: '',
        };
      }
    },
    async startUpdate() {
      const sdkStore = useSdkStore();
      await sdkStore.citadel.manager.system.startUpdate();
    },
    hideUpdateConfirmationModal() {
      this.showUpdateConfirmationModal = false;
    },
    confirmUpdate() {
      this.showUpdateConfirmationModal = true;
    },
    async getUpdateStatus() {
      const sdkStore = useSdkStore();
      const status = await sdkStore.citadel.manager.system.updateStatus();
      if (status?.progress) {
        this.updateStatus = status;
      }
    },
    async getDiskInfo() {
      const sdkStore = useSdkStore();
      const status = (await sdkStore.citadel.manager.system.disk()) === 'nvme';
      if (status) {
        this.isNvme = status;
      }
    },
    async getBackupStatus() {
      const sdkStore = useSdkStore();
      const status = await sdkStore.citadel.manager.system.backupStatus();
      if (status && status.timestamp) {
        this.backupStatus = status;
      }
    },
    async getDebugResult() {
      const sdkStore = useSdkStore();
      const result = await sdkStore.citadel.manager.system.debugResult();
      if (!result) {
        throw new Error('Get debug request failed');
      }

      this.debugStatus = result;
    },
    async debug() {
      const sdkStore = useSdkStore();
      this.debugStatus = await sdkStore.citadel.manager.system.debug();
    },
    async shutdown() {
      const sdkStore = useSdkStore();
      // Reset any cached hasShutdown value from previous shutdown
      this.hasShutdown = false;

      // Shutting down
      await sdkStore.citadel.manager.system.shutdown();

      this.shuttingDown = true;

      // Poll to check if system has shut down
      const pollIfDown = window.setInterval(async () => {
        try {
          const {version} = await sdkStore.citadel.manager.ping();
          if (!version) {
            // System shut down successfully
            window.clearInterval(pollIfDown);
            // Optimistically give another 30s to the system to shut down
            return window.setTimeout(() => {
              this.shuttingDown = false;
              this.hasShutdown = true;
            }, 30 * 1000);
          }
        } catch {
          // System shut down successfully
          window.clearInterval(pollIfDown);
          // Optimistically give another 30s to the system to shut down
          return window.setTimeout(() => {
            this.shuttingDown = false;
            this.hasShutdown = true;
          }, 30 * 1000);
        }
      }, 2000);
    },
    async reboot() {
      const sdkStore = useSdkStore();
      // Reset any cached hasRebooted value from previous reboot
      this.hasRebooted = false;

      // Rebooting
      await sdkStore.citadel.manager.system.reboot();

      this.rebooting = true;

      let pollIfUp: number;

      const pollIfUpFunction = async () => {
        const {version} = await sdkStore.citadel.manager.ping();
        if (version) {
          // System is online again
          this.rebooting = false;
          this.hasRebooted = true;

          // user has to re-login
          window.location.reload();
        }
      };
      // Poll to check if system has shut down
      const pollIfDown = window.setInterval(async () => {
        try {
          const {version} = await sdkStore.citadel.manager.ping();
          if (!version) {
            // System shut down successfully
            window.clearInterval(pollIfDown);

            // Now we'll poll to check if it's up
            pollIfUp = window.setInterval(pollIfUpFunction, 2000);
            return;
          }
        } catch {
          // System shut down successfully
          window.clearInterval(pollIfDown);
          window.clearInterval(pollIfUp);

          // Now we'll poll to check if it's up
          pollIfUp = window.setInterval(pollIfUpFunction, 2000);
          return;
        }
      }, 2000);
    },
    async getStorage() {
      const sdkStore = useSdkStore();
      const storage = await await sdkStore.citadel.manager.system.storage();
      if (storage && storage.total) {
        storage.breakdown.sort((app1, app2) => app2.used - app1.used);
        this.storage = storage;
      }
    },
    async getRam() {
      const sdkStore = useSdkStore();
      const ram = await sdkStore.citadel.manager.system.memory();
      if (ram && ram.total) {
        ram.breakdown.sort((app1, app2) => app2.used - app1.used);
        this.ram = ram;
      }
    },
    async getIsCitadelOS() {
      const sdkStore = useSdkStore();
      const isCitadelOS = await sdkStore.citadel.manager.system.isCitadelOS();
      this.isCitadelOS = isCitadelOS;
    },
    async getCpuTemperature() {
      const sdkStore = useSdkStore();
      const cpuTemperature =
        await sdkStore.citadel.manager.system.temperature();
      if (cpuTemperature) {
        this.cpuTemperature = cpuTemperature;
      }
    },
    async getCpuTemperatureUnit() {
      if (
        window.localStorage &&
        window.localStorage.getItem('cpuTemperatureUnit')
      ) {
        this.cpuTemperatureUnit = window.localStorage.getItem(
          'cpuTemperatureUnit',
        ) as 'celsius' | 'fahrenheit';
      }
    },
    changeCpuTemperatureUnit(unit: 'celsius' | 'fahrenheit') {
      if (unit === 'celsius' || unit === 'fahrenheit') {
        window.localStorage.setItem('cpuTemperatureUnit', unit);
        this.cpuTemperatureUnit = unit;
      }
    },
    async getUptime() {
      const sdkStore = useSdkStore();
      const uptime = await sdkStore.citadel.manager.system.uptime();
      if (uptime) {
        this.uptime = uptime;
      }
    },
  },
});

export default useSystemStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSystemStore, import.meta.hot));
}
