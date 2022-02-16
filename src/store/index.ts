import { ActionTree, createStore, GetterTree, MutationTree } from "vuex";

//Modules
import user, { type State as UserState } from "./modules/user";
import system, { type State as SystemState } from "./modules/system";
import bitcoin, { type State as BitcoinState } from "./modules/bitcoin";
import lightning, { type State as LightningState } from "./modules/lightning";
import apps, { type State as AppsState } from "./modules/apps";
import Citadel from "@runcitadel/sdk";

export interface RootState {
  isMobileMenuOpen: boolean;
  citadel: Citadel;
  apps: AppsState;
  bitcoin: BitcoinState;
  lightning: LightningState;
  system: SystemState;
  user: UserState;
}

// Initial State
const state = {
  isMobileMenuOpen: true,
  citadel: new Citadel(window.location.origin),
  //citadel: new Citadel("https://node.runcitadel.space"),
};

// Getters
const getters: GetterTree<RootState, RootState> = {
  isMobileMenuOpen(state) {
    return state.isMobileMenuOpen;
  },
  citadel(state) {
    return state.citadel;
  },
};

// Mutations
const mutations: MutationTree<RootState> = {
  toggleMobileMenu(state) {
    //disable body's scrolling on menu open
    if (!state.isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      state.isMobileMenuOpen = true;
    } else {
      document.body.style.overflow = "auto";
      state.isMobileMenuOpen = false;
    }
  },
  setJwt(state, jwt: string) {
    state.citadel.jwt = jwt;
  },
};

// Actions
const actions: ActionTree<RootState, RootState> = {
  toggleMobileMenu(context) {
    context.commit("toggleMobileMenu");
  },
};

export default createStore({
  state: state as RootState,
  mutations,
  actions,
  getters,
  modules: {
    user,
    system,
    bitcoin,
    lightning,
    apps,
  },
});
