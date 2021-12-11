import type { BasicBlock } from "@runcitadel/sdk/dist/middleware/bitcoin";
import type {
  EstimateFeeResponseExtended,
  Transaction_extended,
} from "@runcitadel/sdk/dist/middleware/lnd/transaction";
import { Module } from "vuex";
import { toPrecision } from "../../helpers/units.js";
import { RootState } from "../index.js";

export interface State {
  operational: boolean;
  calibrating: boolean;
  version: string;
  ipAddress: string;
  onionAddress: string;
  p2p: {
    address: string;
    port: string;
    connectionString: string;
  };
  electrum: {
    address: string;
    port: string;
    connectionString: string;
  };
  rpc: {
    rpcuser: string;
    rpcpassword: string;
    address: string;
    port: string;
    connectionString: string;
  };
  currentBlock: number;
  chain: string;
  blockHeight: number;
  blocks: BasicBlock[];
  percent: number;
  depositAddress: string;
  stats: {
    peers: number;
    mempool: number;
    hashrate: number;
    blockchainSize: number;
  };
  peers: {
    total: number;
    inbound: number;
    outbound: number;
  };
  balance: {
    total: number;
    confirmed: number;
    pending: number;
    pendingIn: number;
    pendingOut: number;
  };
  transactions: ({ type: "loading" } | Transaction_extended)[];
  pending: [];
  price: 0;
  fees: Record<
    string,
    {
      total: number | string;
      perByte: number | string;
      sweepAmount?: number;
      error?: boolean;
    }
  >;
}

const bitcoinModule: Module<State, RootState> = {
  // Initial state
  state: () => ({
    operational: false,
    calibrating: false,
    version: "",
    ipAddress: "",
    onionAddress: "",
    p2p: {
      address: "",
      port: "",
      connectionString: "",
    },
    electrum: {
      address: "",
      port: "",
      connectionString: "",
    },
    rpc: {
      rpcuser: "",
      rpcpassword: "",
      address: "",
      port: "",
      connectionString: "",
    },
    currentBlock: 0,
    chain: "",
    blockHeight: 0,
    blocks: [],
    percent: -1, //for loading state
    depositAddress: "",
    stats: {
      peers: -1,
      mempool: -1,
      hashrate: -1,
      blockchainSize: -1,
    },
    peers: {
      total: 0,
      inbound: 0,
      outbound: 0,
    },
    balance: {
      total: -1, //loading
      confirmed: -1,
      pending: -1,
      pendingIn: -1,
      pendingOut: -1,
    },
    transactions: [
      { type: "loading" },
      { type: "loading" },
      { type: "loading" },
      { type: "loading" },
    ],
    pending: [],
    price: 0,
    fees: {
      fast: {
        total: "--",
        perByte: "--",
        error: false,
      },
      normal: {
        total: "--",
        perByte: "--",
        error: false,
      },
      slow: {
        total: "--",
        perByte: "--",
        error: false,
      },
      cheapest: {
        total: "--",
        perByte: "--",
        error: false,
      },
    },
  }),

  // Functions to update the state directly
  mutations: {
    isOperational(state, operational) {
      state.operational = operational;
    },

    ipAddress(state, address) {
      state.ipAddress = address;
    },

    syncStatus(state, sync) {
      state.percent = Number(toPrecision(parseFloat(sync.percent) * 100, 2));
      state.currentBlock = sync.currentBlock;
      state.blockHeight = sync.headerCount;
      state.chain = sync.chain;

      if (sync.status === "calibrating") {
        state.calibrating = true;
      } else {
        state.calibrating = false;
      }
    },

    setBlocks(state, blocks) {
      const mergedBlocks = [...blocks, ...state.blocks];
      // remove duplicate blocks
      const uniqueBlocks = mergedBlocks.filter(
        (v, i, a) => a.findIndex((t) => t.height === v.height) === i
      );
      // limit to latest 6 blocks
      state.blocks = [...uniqueBlocks.slice(0, 6)];
    },

    setVersion(state, version) {
      state.version = version.version;
    },

    setStats(state, stats) {
      state.stats.peers = stats.peers;
      state.stats.mempool = stats.mempool;
      state.stats.blockchainSize = stats.blockchainSize;
      state.stats.hashrate = stats.hashrate;
    },

    setP2PInfo(state, p2pInfo) {
      state.p2p.address = p2pInfo.address;
      state.p2p.port = p2pInfo.port;
      state.p2p.connectionString = p2pInfo.connectionString;
    },

    setElectrumInfo(state, electrumInfo) {
      state.electrum.address = electrumInfo.address;
      state.electrum.port = electrumInfo.port;
      state.electrum.connectionString = electrumInfo.connectionString;
    },

    setRpcInfo(state, rpcInfo) {
      state.rpc.rpcuser = rpcInfo.rpcuser;
      state.rpc.rpcpassword = rpcInfo.rpcpassword;
      state.rpc.address = rpcInfo.address;
      state.rpc.port = rpcInfo.port;
      state.rpc.connectionString = rpcInfo.connectionString;
    },

    peers(state, peers) {
      state.peers.total = peers.total || 0;
      state.peers.inbound = peers.inbound || 0;
      state.peers.outbound = peers.outbound || 0;
    },

    balance(state, balance) {
      state.balance.total = parseInt(balance.totalBalance);
      state.balance.confirmed = parseInt(balance.confirmedBalance);
      state.balance.pending = parseInt(balance.unconfirmedBalance);
    },

    transactions(state, transactions) {
      state.transactions = transactions;
    },

    depositAddress(state, address) {
      state.depositAddress = address;
    },

    fees(
      state,
      fees: {
        fast: EstimateFeeResponseExtended;
        slow: EstimateFeeResponseExtended;
        normal: EstimateFeeResponseExtended;
        cheapest: EstimateFeeResponseExtended;
      }
    ) {
      for (const [speed, estimate] of Object.entries(fees)) {
        state.fees[speed].total = estimate.feeSat;
        state.fees[speed].perByte = estimate.satPerVbyte;
        state.fees[speed].sweepAmount = estimate.sweepAmount;
        state.fees[speed].error = false;
      }
    },

    price(state, usd) {
      state.price = usd;
    },
  },

  // Functions to get data from the API
  actions: {
    async getStatus({ commit, rootState }) {
      const status = await rootState.citadel.middleware.bitcoin.isOperational();

      if (status) {
        commit("isOperational", status);
      }
    },

    async getP2PInfo({ commit, rootState }) {
      const p2pInfo =
        await rootState.citadel.manager.system.getBitcoinP2PConnectionDetails();

      if (p2pInfo) {
        commit("setP2PInfo", p2pInfo);
      }
    },

    async getElectrumInfo({ commit, rootState }) {
      const electrumInfo =
        await rootState.citadel.manager.system.getElectrumConnectionDetails();

      if (electrumInfo) {
        commit("setElectrumInfo", electrumInfo);
      }
    },

    async getRpcInfo({ commit, rootState }) {
      const rpcInfo =
        await rootState.citadel.manager.system.getBitcoinRPConnectionDetails();

      if (rpcInfo) {
        commit("setRpcInfo", rpcInfo);
      }
    },

    async getSync({ commit, rootState }) {
      const sync = await rootState.citadel.middleware.bitcoin.syncStatus();

      if (sync) {
        commit("syncStatus", sync);
      }
    },

    async getBlocks({ commit, state, dispatch, rootState }) {
      await dispatch("getSync");

      // Cache block height array of latest 3 blocks for loading view
      const currentBlock = state.currentBlock;

      // Don't fetch blocks if no new block has been found
      if (state.blocks.length && currentBlock === state.blocks[0]["height"]) {
        return;
      }

      // Don't fetch blocks if < 3 blocks primarily because we don't have a UI
      // ready for a blockchain with < 3 blocks
      if (currentBlock < 3) {
        return;
      }

      //TODO: Fetch only new blocks
      const latestThreeBlocks = rootState.citadel.middleware.bitcoin.blocks(
        currentBlock - 2,
        currentBlock
      );

      // Update blocks
      commit("setBlocks", latestThreeBlocks);
    },

    async getVersion({ commit, rootState }) {
      const version = await rootState.citadel.middleware.bitcoin.version();

      if (version) {
        commit("setVersion", version);
      }
    },

    async getPeers({ commit, rootState }) {
      const peers = await rootState.citadel.middleware.bitcoin.connections();

      if (peers) {
        commit("peers", peers);
      }
    },

    async getStats({ commit, rootState }) {
      const stats = await rootState.citadel.middleware.bitcoin.stats();

      if (stats) {
        const peers = stats.connections;
        const mempool = stats.mempool;
        const hashrate = stats.networkhashps;
        const blockchainSize = stats.size;

        commit("setStats", {
          peers,
          mempool,
          hashrate,
          blockchainSize,
        });
      }
    },

    async getBalance({ commit, rootState }) {
      const balance =
        await rootState.citadel.middleware.lnd.wallet.onChainBalance();

      if (balance) {
        commit("balance", balance);
      }
    },

    async getTransactions({ commit, rootState }) {
      const transactions =
        await rootState.citadel.middleware.lnd.transaction.getOnChainTransactions();
      commit("transactions", transactions);
    },

    async getPrice({ commit, rootState }) {
      const price = await rootState.citadel.manager.external.price("USD");

      if (price) {
        commit("price", price);
      }
    },

    async getDepositAddress({ commit, rootState }) {
      const { address } = await rootState.citadel.middleware.lnd.address();

      if (address) {
        commit("depositAddress", address);
      }
    },

    async getFees({ commit, rootState }, { address, confTarget, amt, sweep }) {
      const fees =
        await rootState.citadel.middleware.lnd.transaction.estimateFeeAll(
          address,
          amt,
          sweep
        );

      if (fees) {
        commit("fees", fees);
      }
    },
  },
  getters: {
    status(state) {
      const data = {
        class: "loading",
        text: "Loading...",
      };

      if (state.operational) {
        data.class = "active";
        data.text = "Operational";
      }

      return data;
    },
    transactions(state) {
      const txs: {
        type: "incoming" | "outgoing";
        amount: number | string;
        timestamp: Date;
        description: string;
        hash: string;
        confirmations: string | number;
      }[] = [];

      //return default "loading" transactions until txs aren't fetched
      if (
        state.transactions &&
        state.transactions.length &&
        state.transactions[0]["type"] === "loading"
      ) {
        return state.transactions;
      }

      if (state.transactions) {
        (state.transactions as Transaction_extended[]).forEach(
          (tx: Transaction_extended) => {
            const amount = Number(tx.amount);

            let type: "incoming" | "outgoing" = "incoming";
            if (amount < 0) {
              type = "outgoing";
            } else if (amount === 0) {
              //skip self incoming txs of change
              return;
            }

            // if (tx.numConfirmations === 0) {

            // }
            // type = "pending";

            let description = "Unknown";

            if (tx.type === "CHANNEL_OPEN" || tx.type === "PENDING_OPEN") {
              description = "Lightning Wallet";
            } else if (
              tx.type === "CHANNEL_CLOSE" ||
              tx.type === "PENDING_CLOSE"
            ) {
              description = "Lightning Wallet";
            } else if (tx.type === "ON_CHAIN_TRANSACTION_SENT") {
              description = "Withdrawal";
            } else if (tx.type === "ON_CHAIN_TRANSACTION_RECEIVED") {
              description = "Deposit";
            }

            txs.push({
              type,
              amount: amount < 0 ? amount * -1 : amount, //for formatting +/- in view
              timestamp: new Date(Number(tx.timeStamp) * 1000),
              description,
              hash: tx.txHash,
              confirmations: tx.numConfirmations,
            });
          }
        );

        // Sort txs by date
        txs.sort(function (tx1, tx2) {
          // @ts-ignore
          return tx2.timestamp - tx1.timestamp;
        });
      }

      return txs;
    },
  },
};

export default {
  namespaced: true,
  ...bitcoinModule
};

