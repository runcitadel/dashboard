import {createRouter, createWebHistory} from 'vue-router';
import useUserStore from '../store/user';
import useUiStore from '../store/ui';

const WrapperLayout = () => import('../layouts/WrapperLayout.vue');
const DashboardLayout = () => import('../layouts/DashboardLayout.vue');

const Start = () => import('../views/Start.vue');
const Login = () => import('../views/Login.vue');
const Dashboard = () => import('../views/Dashboard.vue');
const Bitcoin = () => import('../views/Bitcoin.vue');
const Lightning = () => import('../views/Lightning.vue');
const Apps = () => import('../views/Apps.vue');
const AppStore = () => import('../views/AppStore.vue');
const AppStoreApp = () => import('../views/AppStoreApp.vue');
const AppStoreCategory = () => import('../views/AppStoreCategory.vue');
const Https = () => import('../views/Https.vue');
const Nirvati = () => import('../views/Nirvati.vue');
const HttpsSetup = () => import('../views/HttpsSetup.vue');
const HttpsIncompatible = () => import('../views/HttpsIncompatible.vue');
const HttpsSetupApp = () => import('../views/HttpsSetupApp.vue');
const HttpsRunningcitadel = () => import('../views/HttpsRunningcitadel.vue');
const Settings = () => import('../views/Settings.vue');
const LightningAddress = () => import('../views/LightningAddress.vue');
const ConnectWallet = () => import('../views/ConnectWallet.vue');
const Donate = () => import('../views/Donate.vue');

// Wallet components for wallet connector
const BitBoxApp = () =>
  import('../components/ConnectWallet/Wallets/BitBoxApp.vue');
const BitcoinCoreP2P = () =>
  import('../components/ConnectWallet/Wallets/BitcoinCoreP2P.vue');
const BitcoinCoreRPC = () =>
  import('../components/ConnectWallet/Wallets/BitcoinCoreRPC.vue');
const BlockstreamGreen = () =>
  import('../components/ConnectWallet/Wallets/BlockstreamGreen.vue');
const BlueWallet = () =>
  import('../components/ConnectWallet/Wallets/BlueWallet.vue');
const ElectrumAndroid = () =>
  import('../components/ConnectWallet/Wallets/ElectrumAndroid.vue');
const ElectrumDesktop = () =>
  import('../components/ConnectWallet/Wallets/ElectrumDesktop.vue');
const ElectrumServer = () =>
  import('../components/ConnectWallet/Wallets/ElectrumServer.vue');
const FullyNoded = () =>
  import('../components/ConnectWallet/Wallets/FullyNoded.vue');
const LilyWallet = () =>
  import('../components/ConnectWallet/Wallets/LilyWallet.vue');
const Phoenix = () => import('../components/ConnectWallet/Wallets/Phoenix.vue');
const SamouraiWallet = () =>
  import('../components/ConnectWallet/Wallets/SamouraiWallet.vue');
const Sparrow = () => import('../components/ConnectWallet/Wallets/Sparrow.vue');
const SpecterDesktop = () =>
  import('../components/ConnectWallet/Wallets/SpecterDesktop.vue');
const Wasabi = () => import('../components/ConnectWallet/Wallets/Wasabi.vue');

const ZapAndroid = () =>
  import('../components/ConnectWallet/Wallets/ZapAndroid.vue');
const ZapiOS = () => import('../components/ConnectWallet/Wallets/ZapiOS.vue');
const ZapDesktop = () =>
  import('../components/ConnectWallet/Wallets/ZapDesktop.vue');
const Zeus = () => import('../components/ConnectWallet/Wallets/Zeus.vue');
const LightningATM = () =>
  import('../components/ConnectWallet/Wallets/LightningATM.vue');

const LNDConnectGRPCLocal = () =>
  import('../components/ConnectWallet/Wallets/LNDConnectGRPCLocal.vue');
const LNDConnectGRPCTor = () =>
  import('../components/ConnectWallet/Wallets/LNDConnectGRPCTor.vue');
const LNDConnectRESTLocal = () =>
  import('../components/ConnectWallet/Wallets/LNDConnectRESTLocal.vue');
const LNDConnectRESTTor = () =>
  import('../components/ConnectWallet/Wallets/LNDConnectRESTTor.vue');

const routes = [
  {
    path: '/',
    component: WrapperLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: Login,
        meta: {requiresAuth: false},
      },
      {
        path: '/start',
        component: Start,
        meta: {requiresAuth: false},
        name: 'start',
      },
      {
        path: '/dashboard',
        component: DashboardLayout,
        meta: {requiresAuth: true},
        children: [
          {
            path: '',
            name: 'dashboard',
            component: Dashboard,
          },
        ],
      },
      {
        path: '/bitcoin',
        component: DashboardLayout,
        meta: {requiresAuth: true},
        children: [
          {
            path: '',
            name: 'bitcoin',
            component: Bitcoin,
          },
        ],
      },
      {
        path: '/lightning',
        component: DashboardLayout,
        meta: {requiresAuth: true},
        children: [
          {
            path: '',
            name: 'lightning',
            component: Lightning,
          },
        ],
      },
      {
        path: '/donate',
        component: DashboardLayout,
        meta: {requiresAuth: true},
        children: [
          {
            path: '',
            name: 'donate',
            component: Donate,
          },
        ],
      },
      {
        path: '/nirvati',
        component: DashboardLayout,
        meta: {requiresAuth: true},
        children: [
          {
            path: '',
            name: 'nirvati',
            component: Nirvati,
          },
        ],
      },
      {
        path: '/lightning-address',
        component: DashboardLayout,
        meta: {requiresAuth: true},
        children: [
          {
            path: '',
            name: 'lightning-address',
            component: LightningAddress,
          },
        ],
      },
      {
        path: '/apps',
        component: DashboardLayout,
        meta: {requiresAuth: true},
        children: [
          {
            path: '',
            name: 'apps',
            component: Apps,
          },
        ],
      },
      {
        path: '/app-store',
        component: DashboardLayout,
        meta: {requiresAuth: true},
        children: [
          {
            path: '',
            name: 'app-store',
            component: AppStore,
          },
          {
            path: 'category/:category',
            name: 'app-store-category',
            component: AppStoreCategory,
          },
          {
            path: 'app/:id',
            name: 'app-store-app',
            component: AppStoreApp,
          },
        ],
      },
      {
        path: '/https',
        component: DashboardLayout,
        meta: {requiresAuth: true},
        children: [
          {
            path: '',
            name: 'https',
            component: Https,
          },
          {
            path: 'incompatible',
            name: 'https-incompatible',
            component: HttpsIncompatible,
          },
          {
            path: 'setup',
            name: 'https-setup',
            component: HttpsSetup,
          },
          {
            path: 'setup/:app',
            name: 'https-setup-app',
            component: HttpsSetupApp,
          },
          {
            path: 'setup-runningcitadel',
            name: 'https-runningcitadel',
            component: HttpsRunningcitadel,
          },
        ],
      },
      {
        path: '/settings',
        component: DashboardLayout,
        meta: {requiresAuth: true},
        children: [
          {
            path: '',
            name: 'settings',
            component: Settings,
          },
        ],
      },
      {
        path: '/connect',
        component: DashboardLayout,
        meta: {requiresAuth: true},
        children: [
          {
            path: '',
            name: 'connect',
            component: ConnectWallet,
            children: [
              {
                path: 'bitboxapp',
                component: BitBoxApp,
                meta: {
                  wallet: 'bitboxapp',
                },
              },
              {
                path: 'blockstream-green',
                component: BlockstreamGreen,
                meta: {
                  wallet: 'blockstream-green',
                },
              },
              {
                path: 'bluewallet',
                component: BlueWallet,
                meta: {
                  wallet: 'bluewallet',
                },
              },
              {
                path: 'electrum-android',
                component: ElectrumAndroid,
                meta: {
                  wallet: 'electrum-android',
                },
              },
              {
                path: 'lightning-atm',
                component: LightningATM,
                meta: {
                  wallet: 'lightning-atm',
                },
              },
              {
                path: 'electrum-desktop',
                component: ElectrumDesktop,
                meta: {
                  wallet: 'electrum-desktop',
                },
              },
              {
                path: 'fully-noded',
                component: FullyNoded,
                meta: {
                  wallet: 'fully-noded',
                },
              },
              {
                path: 'lily-wallet',
                component: LilyWallet,
                meta: {
                  wallet: 'lily-wallet',
                },
              },
              {
                path: 'phoenix',
                component: Phoenix,
                meta: {
                  wallet: 'phoenix',
                },
              },
              {
                path: 'samourai-wallet',
                component: SamouraiWallet,
                meta: {
                  wallet: 'samourai-wallet',
                },
              },
              {
                path: 'sparrow',
                component: Sparrow,
                meta: {
                  wallet: 'sparrow',
                },
              },
              {
                path: 'specter-desktop',
                component: SpecterDesktop,
                meta: {
                  wallet: 'specter-desktop',
                },
              },
              {
                path: 'wasabi',
                component: Wasabi,
                meta: {
                  wallet: 'wasabi',
                },
              },
              {
                path: 'bitcoin-core-p2p',
                component: BitcoinCoreP2P,
                meta: {
                  wallet: 'bitcoin-core-p2p',
                },
              },
              {
                path: 'bitcoin-core-rpc',
                component: BitcoinCoreRPC,
                meta: {
                  wallet: 'bitcoin-core-rpc',
                },
              },
              {
                path: 'electrum-server',
                component: ElectrumServer,
                meta: {
                  wallet: 'electrum-server',
                },
              },
              {
                path: 'zap-android',
                component: ZapAndroid,
                meta: {
                  wallet: 'zap-android',
                },
              },
              {
                path: 'zap-desktop',
                component: ZapDesktop,
                meta: {
                  wallet: 'zap-desktop',
                },
              },
              {
                path: 'zap-ios',
                component: ZapiOS,
                meta: {
                  wallet: 'zap-ios',
                },
              },
              {
                path: 'zeus',
                component: Zeus,
                meta: {
                  wallet: 'zeus',
                },
              },
              {
                path: 'lndconnect-grpc-local',
                component: LNDConnectGRPCLocal,
                meta: {
                  wallet: 'lndconnect-grpc-local',
                },
              },
              {
                path: 'lndconnect-grpc-tor',
                component: LNDConnectGRPCTor,
                meta: {
                  wallet: 'lndconnect-grpc-tor',
                },
              },
              {
                path: 'lndconnect-rest-local',
                component: LNDConnectRESTLocal,
                meta: {
                  wallet: 'lndconnect-rest-local',
                },
              },
              {
                path: 'lndconnect-rest-tor',
                component: LNDConnectRESTTor,
                meta: {
                  wallet: 'lndconnect-rest-tor',
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
  // @ts-expect-error lib type wrong
  scrollBehavior: (to, from, savedPosition) => {
    // Exists when Browser's back/forward pressed
    if (savedPosition) {
      return savedPosition;
      // For anchors
    } else if (to.hash) {
      // 500ms timeout allows the page to load or else
      // smooth scrolling would not scroll to the correct position
      setTimeout(() => {
        const element = document.getElementById(to.hash.replace(/#/, ''));
        if (element && element.scrollIntoView) {
          element.scrollIntoView({block: 'end', behavior: 'smooth'});
        }
      }, 500);

      return {el: to.hash};
      // By changing queries we are still in the same component, so "from.path" === "to.path" (new query changes just "to.fullPath", but not "to.path").
    } else if (from.path === to.path) {
      return {};
    }
    // Scroll to top
    return {left: 0, top: 0};
  },
});

//Authentication Check
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!userStore.jwt) {
      next({
        path: '/',
        query: {redirect: to.fullPath},
      });
    } else {
      next();
    }
  } else {
    next(); // always call next()!
  }
});

//Close Mobile Menu after route change
router.afterEach(() => {
  const uiStore = useUiStore();
  uiStore.isMobileMenuOpen = false;
});

export default router;
