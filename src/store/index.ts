import { ActionTree, createStore, GetterTree, MutationTree } from "vuex";

//Modules
import user from "./modules/user";
import system from "./modules/system";
import bitcoin from "./modules/bitcoin";
import lightning from "./modules/lightning";
import apps from "./modules/apps";
import Citadel from "@runcitadel/sdk";

export interface RootState {
  isMobileMenuOpen: boolean;
  citadel: Citadel;
}

// Initial State
const state = {
  isMobileMenuOpen: true,
  citadel: new Citadel("http://192.168.1.231/"),
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
  state,
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
