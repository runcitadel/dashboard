import {defineStore} from 'pinia';
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
  sdkStore: ReturnType<typeof useSdkStore>;
}

// Initial state
export default defineStore('user', {
  state: (): State => ({
    name: '',
    jwt: window.localStorage.getItem('jwt') || '',
    registered: true,
    totpKey: '',
    totpEnabled: false,
    totpAuthenticated: false,
    seed: [],
    installedApps: [],
    sdkStore: useSdkStore(),
  }),

  // Functions to get data from the API
  actions: {
    async login({password, totpToken}: {password: string; totpToken: string}) {
      const jwt = await this.sdkStore.citadel.manager.auth.login(
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
      window.localStorage.setItem('jwt', jwt);
      this.jwt = jwt;
      this.sdkStore.setJwt(jwt);
    },

    async refreshJWT() {
      try {
        const jwt = await this.sdkStore.citadel.manager.auth.refresh();
        if (jwt) {
          this.setJwt(jwt);
        }
      } catch {
        this.setJwt('');
        router.push('/');
      }
    },

    async getRegistered() {
      const registered =
        await this.sdkStore.citadel.manager.auth.isRegistered();
      this.registered = registered;
    },

    async getInfo() {
      const {name, installedApps} =
        await this.sdkStore.citadel.manager.auth.info();
      this.name = name;
      this.installedApps = installedApps || [];
    },

    async getTotpKey() {
      const totpKey = await this.sdkStore.citadel.manager.auth.setupTotp();
      this.totpKey = totpKey;
    },

    async getTotpEnabledStatus() {
      const totpEnabled =
        await this.sdkStore.citadel.manager.auth.isTotpEnabled();
      this.totpEnabled = totpEnabled;
    },

    async getSeed(auth?: {password: string; totpToken?: string}) {
      let rawSeed: string[];

      //first check if user is registered or not
      await this.getRegistered();

      //get user's stored seed if already registered
      if (this.registered && auth?.password) {
        rawSeed = await this.sdkStore.citadel.manager.auth.seed(
          auth.password,
          auth.totpToken,
        );
      } else {
        //get a new seed if new user
        rawSeed =
          await this.sdkStore.citadel.middleware.lightning.wallet.generateSeed();
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
      if (!this.registered) {
        const response = await this.sdkStore.citadel.manager.auth.register(
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
