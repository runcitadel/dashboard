import Citadel from '@runcitadel/sdk';
import {defineStore} from 'pinia';
import useUserStore from './user';

export interface State {
  citadel: Citadel;
  userStore: ReturnType<typeof useUserStore>;
}

const isDevelopment = import.meta.env.DEV;

export default defineStore('sdk', {
  state: (): State => {
    const state: State = {
      citadel: new Citadel(
        isDevelopment
          ? `http://${__DEVICE_HOSTNAME__.host}`
          : window.location.origin,
      ),
      userStore: useUserStore(),
    };

    state.citadel.jwt = window.localStorage.getItem('jwt') || '';

    // Redirect back to login on 401
    state.citadel.onAuthFailed = () => {
      // This removes the token everywhere and redirects to login
      state.userStore.logout();
    };

    return state;
  },
  actions: {
    setJwt(newJwt: string) {
      this.citadel.jwt = newJwt;
    },
  },
});
