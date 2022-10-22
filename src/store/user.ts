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
  }),

  // Functions to get data from the API
  actions: {
    async login({password, totpToken}: {password: string; totpToken: string}) {
      const sdkStore = useSdkStore();
      const jwt = await sdkStore.citadel.manager.auth.login(
        password,
        totpToken,
      );
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
        const jwt = await sdkStore.citadel.manager.auth.refresh();
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
      const registered = await sdkStore.citadel.manager.auth.isRegistered();
      this.registered = registered;
    },

    async getInfo() {
      const sdkStore = useSdkStore();
      const {name, installedApps} = await sdkStore.citadel.manager.auth.info();
      this.name = name;
      this.installedApps = installedApps || [];
    },

    async getTotpKey() {
      const sdkStore = useSdkStore();
      const totpKey = await sdkStore.citadel.manager.auth.setupTotp();
      this.totpKey = totpKey;
    },

    async getTotpEnabledStatus() {
      const sdkStore = useSdkStore();
      const totpEnabled = await sdkStore.citadel.manager.auth.isTotpEnabled();
      this.totpEnabled = totpEnabled;
    },

    async getSeed(auth?: {password: string; totpToken?: string}) {
      const sdkStore = useSdkStore();
      let rawSeed: string[];

      //first check if user is registered or not
      await this.getRegistered();

      //get user's stored seed if already registered
      if (this.registered && auth?.password) {
        rawSeed = await sdkStore.citadel.manager.auth.seed(
          auth.password,
          auth.totpToken,
        );
      } else {
        //get a new seed if new user
        rawSeed =
          await sdkStore.citadel.middleware.lightning.wallet.generateSeed();
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
        const response = await sdkStore.citadel.manager.auth.register(
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
  },
});

export default useUserStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
