import {defineStore} from 'pinia';

export interface State {
  isMobileMenuOpen: boolean;
  userTheme: 'light' | 'dark';
}

export default defineStore('ui', {
  // Initial state
  state: (): State => ({
    isMobileMenuOpen: false,
    userTheme: 'light',
  }),
  actions: {
    setTheme(theme: 'light' | 'dark') {
      this.userTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('user-theme', theme);
    },
  },
});
