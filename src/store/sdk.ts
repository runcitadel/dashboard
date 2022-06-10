import Citadel from '../../node_modules/@runcitadel/sdk/dist/index.js';
import {defineStore} from 'pinia';

export interface State {
  citadel: Citadel;
}

export default defineStore('sdk', {
  state: (): State => {
    const state: State = {
      citadel: new Citadel(
        process.env.NODE_ENV === 'development'
          ? 'http://citadel-dev.local'
          : window.location.origin,
      ),
      //citadel: new Citadel('https://node.runcitadel.space'),
    };
    state.citadel.jwt = window.localStorage.getItem('jwt') || '';
    return state;
  },
  actions: {
    setJwt(newJwt: string) {
      this.citadel.jwt = newJwt;
    },
  },
});
