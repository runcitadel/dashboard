import { createStore } from "vuex";

//Modules
import user from "./modules/user";
import system from "./modules/system";
import bitcoin from "./modules/bitcoin";
import lightning from "./modules/lightning";
import apps from "./modules/apps";

// Initial State
const state = {
  isMobileMenuOpen: true,
};

// Getters
const getters = {
  isMobileMenuOpen(state) {
    return state.isMobileMenuOpen;
  },
};

// Mutations
const mutations = {
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
};

// Actions
const actions = {
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
