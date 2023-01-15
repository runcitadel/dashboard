import {defineStore, acceptHMRUpdate} from 'pinia';
import router from '../router/index.js';
import useSdkStore from './sdk';

export interface State {
  name: string;
  jwt: string;
  registered: boolean;
  totpKey: string;
  totpEnabled: boolean;
  totpAuthenticated: boolean;
  seed: string[];
  installedApps: string[];
  letsencryptSettings: {
    email?: string | undefined;
    agreed_lets_encrypt_tos?: boolean | undefined;
    app_domains?: Record<string, string> | undefined;
  };
  runningCitadelSettings: {
    isSetup: boolean;
    username: string;
    password: string;
    subdomain: string;
  };
  ipAddr: string;
}

// Initial state
const useUserStore = defineStore('user', {
  state: (): State => ({
    name: '',
    jwt: window.localStorage.getItem('jwt') || '',
    registered: true,
    totpKey: '',
    totpEnabled: false,
    totpAuthenticated: false,
    seed: [],
    installedApps: [],
    letsencryptSettings: {},
    runningCitadelSettings: {
      isSetup: false,
      username: '',
      password: '',
      subdomain: '',
    },
    ipAddr: '',
  }),

  // Functions to get data from the API
  actions: {
    async login({password, totpToken}: {password: string; totpToken: string}) {
      const sdkStore = useSdkStore();
      const jwt = await sdkStore.citadel.auth.login(password, totpToken);
      if (jwt) {
        this.setJwt(jwt);
      }
    },

    logout() {
      if (this.jwt) {
        this.setJwt('');
        router.push('/');
      }
    },

    async setJwt(jwt: string) {
      const sdkStore = useSdkStore();
      window.localStorage.setItem('jwt', jwt);
      this.jwt = jwt;
      sdkStore.setJwt(jwt);
    },

    async refreshJWT() {
      const sdkStore = useSdkStore();
      try {
        const jwt = await sdkStore.citadel.auth.refresh();
        if (jwt) {
          this.setJwt(jwt);
        }
      } catch {
        this.setJwt('');
        router.push('/');
      }
    },

    async getRegistered() {
      const sdkStore = useSdkStore();
      const registered = await sdkStore.citadel.auth.isRegistered();
      this.registered = registered;
    },

    async getInfo() {
      const sdkStore = useSdkStore();
      const {name, installedApps} = await sdkStore.citadel.auth.info();
      this.name = name;
      this.installedApps = installedApps || [];
    },

    async getTotpKey() {
      const sdkStore = useSdkStore();
      const totpKey = await sdkStore.citadel.auth.setupTotp();
      this.totpKey = totpKey;
    },

    async getTotpEnabledStatus() {
      const sdkStore = useSdkStore();
      const totpEnabled = await sdkStore.citadel.auth.isTotpEnabled();
      this.totpEnabled = totpEnabled;
    },

    async getSeed(auth?: {password: string; totpToken?: string}) {
      const sdkStore = useSdkStore();
      let rawSeed: string[];

      //first check if user is registered or not
      await this.getRegistered();

      //get user's stored seed if already registered
      if (this.registered && auth?.password) {
        rawSeed = await sdkStore.citadel.auth.seed(
          auth.password,
          auth.totpToken,
        );
      } else {
        //get a new seed if new user
        rawSeed = await sdkStore.citadel.lightning.wallet.generateSeed();
      }

      if (rawSeed) {
        this.seed = rawSeed;
      }
    },

    async register({
      name,
      password,
      seed,
    }: {
      name: string;
      password: string;
      seed: string[];
    }) {
      const sdkStore = useSdkStore();
      if (!this.registered) {
        const response = await sdkStore.citadel.auth.register(
          name,
          password,
          seed,
        );

        if (response && response.jwt) {
          this.setJwt(response.jwt);
          this.registered = true;
          this.seed = []; // Remove seed from store
        }
      }
    },
    async getRunningCitadelSettings() {
      const sdkStore = useSdkStore();
      this.runningCitadelSettings =
        await sdkStore.citadel.auth.runningCitadelStatus();
    },
    async getLetsEncryptSettings() {
      const sdkStore = useSdkStore();
      this.letsencryptSettings =
        await sdkStore.citadel.auth.letsEncryptStatus();
    },
    async enableLetsEncrypt() {
      const sdkStore = useSdkStore();
      if (
        this.letsencryptSettings.agreed_lets_encrypt_tos &&
        !!this.letsencryptSettings.email
      ) {
        await sdkStore.citadel.auth.enableLetsEncrypt(
          this.letsencryptSettings.email!,
        );
      }
    },
    async getIpAddr() {
      const sdkStore = useSdkStore();
      this.ipAddr = await sdkStore.citadel.auth.ipAddr();
    },
  },
});

export default useUserStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
