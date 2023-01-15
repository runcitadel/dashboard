import {defineStore, acceptHMRUpdate} from 'pinia';

export interface State {
  isMobileMenuOpen: boolean;
  userTheme: 'light' | 'dark';
  showBalance: boolean;
}

const useUiStore = defineStore('ui', {
  // Initial state
  state: (): State => ({
    isMobileMenuOpen: false,
    userTheme: 'light',
    showBalance: true,
  }),
  actions: {
    setTheme(theme: 'light' | 'dark') {
      this.userTheme = theme;
      document.documentElement.setAttribute('data-bs-theme', theme);
      localStorage.setItem('user-theme', theme);
    },
    toggleBalance() {
      this.showBalance = !this.showBalance;
    },
  },
});

export default useUiStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot));
}
