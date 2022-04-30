import {defineStore} from 'pinia';

export interface State {
  isMobileMenuOpen: boolean;
  userTheme: 'light' | 'dark';
  showBalance: boolean;
}

export default defineStore('ui', {
  // Initial state
  state: (): State => ({
    isMobileMenuOpen: false,
    userTheme: 'light',
    showBalance: true,
  }),
  actions: {
    setTheme(theme: 'light' | 'dark') {
      this.userTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('user-theme', theme);
    },
    toggleBalance() {
      this.showBalance = !this.showBalance;
    },
  },
});
