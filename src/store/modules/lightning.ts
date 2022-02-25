import type { Channel } from "@runcitadel/sdk";
type Channel_extended = Channel & {
  type?: string;
};
import { Module } from "vuex";
import { RootState } from "..";
import { toPrecision } from "../../helpers/units";

enum Invoice_InvoiceState {
  OPEN = 0,
  SETTLED = 1,
  CANCELED = 2,
  ACCEPTED = 3,
  UNRECOGNIZED = -1,
}

export type IncomingTransaction = {
  type: "incoming" | "expired" | "pending";
  amount: number;
  timestamp: Date;
  description: string;
  expiresOn: Date;
  paymentRequest: string;
};
export type OutgoingTransaction = {
  type: "outgoing";
  amount: number;
  timestamp: Date;
  paymentRequest: string;
  paymentPreImage: string;
  fee: number;
  description?: string;
};
export type CustomTransactionType = {
  type: string;
  amount: number;
  timestamp: Date;
  description: string;
  expiresOn?: Date;
  paymentRequest: string;
  paymentPreImage?: string;
};
export interface State {
  operational: boolean;
  unlocked: boolean;
  version: string;
  implementation: string;
  currentBlock: number;
  blockHeight: number;
  percent: number;
  balance: {
    total: number;
    confirmed: number;
    pending: number;
  };
  alias: string;
  pubkey: string;
  lndConnectUrls: {
    restTor: string;
    restLocal: string;
    grpcTor: string;
    grpcLocal: string;
  };
  uris: string[];
  numPendingChannels: number;
  numActiveChannels: number;
  numPeers: -1;
  channels: [
    { type: "loading" },
    { type: "loading" },
    { type: "loading" },
    { type: "loading" }
  ];
  connectionCode: string;
  maxSend: number;
  maxReceive: number;
  transactions: (CustomTransactionType | { type: "loading" })[];
  confirmedTransactions: [];
  pendingTransactions: [];
}

const lightningModule: Module<State, RootState> = {
  // Initial state
  state: () => ({
    operational: false,
    unlocked: false,
    version: "",
    implementation: "lnd",
    currentBlock: 0,
    blockHeight: 0,
    percent: -1, //for loading state
    balance: {
      total: -1,
      confirmed: -1,
      pending: -1,
    },
    alias: "",
    pubkey: "",
    lndConnectUrls: {
      restTor: "",
      restLocal: "",
      grpcTor: "",
      grpcLocal: "",
    },
    uris: [],
    numPendingChannels: 0,
    numActiveChannels: -1,
    numPeers: -1,
    channels: [
      { type: "loading" },
      { type: "loading" },
      { type: "loading" },
      { type: "loading" },
    ],
    connectionCode: "unknown",
    maxSend: -1,
    maxReceive: -1,
    transactions: [
      { type: "loading" },
      { type: "loading" },
      { type: "loading" },
      { type: "loading" },
    ],
    confirmedTransactions: [],
    pendingTransactions: [],
  }),
  mutations: {
    isOperational(state, operational) {
      state.operational = operational;
    },

    setSync(state, sync) {
      state.percent = Number(toPrecision(parseFloat(sync.percent) * 100, 2));
      state.blockHeight = sync.knownBlockCount;
      state.currentBlock = sync.processedBlocks;
    },

    isUnlocked(state, unlocked) {
      state.unlocked = unlocked;
    },

    setVersion(state, version) {
      state.version = version;
    },

    setImplementation(state, implementation) {
      state.implementation = implementation || "lnd";
    },

    setConnectionCode(state, code) {
      state.connectionCode = code;
    },

    setNumPeers(state, numPeers) {
      state.numPeers = numPeers;
    },

    setNumActiveChannels(state, numActiveChannels) {
      state.numActiveChannels = numActiveChannels;
    },

    setChannels(state, channels) {
      state.channels = channels;
    },

    setBalance(state, balance) {
      if (balance.confirmed !== undefined) {
        state.balance.confirmed = parseInt(balance.confirmed);
      }

      if (balance.pending !== undefined) {
        state.balance.pending = parseInt(balance.pending);
      }

      state.balance.total = state.balance.confirmed;
    },

    setMaxReceive(state, maxReceive) {
      state.maxReceive = maxReceive;
    },

    setMaxSend(state, maxSend) {
      state.maxSend = maxSend;
    },

    setTransactions(state, transactions) {
      state.transactions = transactions;
    },

    setConfirmedTransactions(state, confirmedTransactions) {
      state.confirmedTransactions = confirmedTransactions;
    },

    setPendingTransactions(state, pendingTransactions) {
      state.pendingTransactions = pendingTransactions;
    },

    setPubKey(state, pubkey) {
      state.pubkey = pubkey;
    },

    setAlias(state, alias) {
      state.alias = alias;
    },

    setUris(state, uris) {
      state.uris = uris;
    },

    setLndConnectUrls(state, urls) {
      state.lndConnectUrls = urls;
    },
  },
  actions: {
    async getStatus({ commit, rootState }) {
      const status = await rootState.citadel.middleware.lnd.info.getStatus();
      if (status) {
        commit("isOperational", status.operational);
        commit("isUnlocked", status.unlocked);
      }
    },

    async getSync({ commit, rootState }) {
      const sync = await rootState.citadel.middleware.lnd.info.syncStatus();
      if (sync && sync.percent) {
        commit("setSync", sync);
      }
    },

    //basically fetches everything
    async getLndPageData({ commit, dispatch, rootState }) {
      const data = await rootState.citadel.middleware.pages.lightning();
      const versionInfo = await rootState.citadel.middleware.lnd.info.version();

      if (data) {
        const channels = data.channels || [];
        dispatch("getChannels", channels);

        const lightningInfo = data.lightningInfo;

        commit("setAlias", lightningInfo.alias);
        commit("setUris", lightningInfo.uris);
        commit("setPubKey", lightningInfo.identityPubkey);
        commit("setVersion", lightningInfo.version);
        commit("setNumPeers", lightningInfo.numPeers);
        commit("setNumActiveChannels", lightningInfo.numActiveChannels);
      }

      if (versionInfo) {
        commit("setVersion", versionInfo.version);
        commit("setImplementation", versionInfo.implementation);
      }
    },

    //basically fetches everything
    async getVersionInfo({ commit, rootState }) {
      const versionInfo = await rootState.citadel.middleware.lnd.info.version();

      if (versionInfo) {
        commit("setVersion", versionInfo.version);
        commit("setImplementation", versionInfo.implementation);
      }
    },

    async getConnectionCode({ commit, rootState }) {
      const uris = await rootState.citadel.middleware.lnd.info.publicUris();

      if (uris && uris.length > 0) {
        commit("setConnectionCode", uris[0]);
      } else {
        commit("setConnectionCode", "Could not determine lnd connection code");
      }
    },

    // Deprecated, this endpoint returns balance data minus estimated channel closing fees
    // These estimates have caused many customers to be confused by the numbers displayed in the dashboard (leaky sats)
    // Instead we can calculate our total balance by getting the sum of each channel's localBalance
    async getBalance({ commit, rootState }) {
      const balance =
        await rootState.citadel.middleware.lnd.wallet.lightningBalance();

      if (balance) {
        commit("setBalance", { confirmed: balance });
      }
    },

    async getChannels({ commit, rootState }, preFetchedChannels = []) {
      let rawChannels: (Channel_extended & {
        status?:
          | "Online"
          | "Offline"
          | "Opening"
          | "Closing"
          | "Unknown"
          | "WAITING_CLOSING_CHANNEL"
          | "FORCE_CLOSING_CHANNEL"
          | "PENDING_OPEN_CHANNEL";
        name?: string;
        purpose?: string;
      })[];

      if (preFetchedChannels.length) {
        //eg when used by lnd page
        rawChannels = preFetchedChannels;
      } else {
        rawChannels = await rootState.citadel.middleware.lnd.channel.list();
      }

      const channels: (Channel & {
        type?: string | undefined;
      } & {
        status?:
          | "Online"
          | "Offline"
          | "Opening"
          | "Closing"
          | "Unknown"
          | "WAITING_CLOSING_CHANNEL"
          | "FORCE_CLOSING_CHANNEL"
          | "PENDING_OPEN_CHANNEL"
          | undefined;
        name?: string | undefined;
        purpose?: string | undefined;
      })[] = [];
      let confirmedBalance = 0;
      let pendingBalance = 0;
      let maxReceive = 0;
      let maxSend = 0;

      if (rawChannels) {
        // Loop through channels to determine pending balance, max payment amount, and sort channels by type
        rawChannels.forEach((channel) => {
          const localBalance = parseInt(channel.localBalance as string) || 0;
          const remoteBalance = parseInt(channel.remoteBalance as string) || 0;

          if (channel.type === "OPEN") {
            if (channel.active) {
              channel.status = "Online";
            } else {
              channel.status = "Offline";
            }

            maxReceive += remoteBalance;
            maxSend += localBalance;

            confirmedBalance += localBalance;
          } else if (channel.type === "PENDING_OPEN_CHANNEL") {
            pendingBalance += localBalance;
            channel.status = "Opening";
          } else if (
            [
              "WAITING_CLOSING_CHANNEL",
              "FORCE_CLOSING_CHANNEL",
              "PENDING_CLOSING_CHANNEL",
            ].includes(channel.type as string)
          ) {
            pendingBalance += localBalance;
            channel.status = "Closing";

            // Lnd doesn't provide initiator or autopilot data via rpc. So, we just display a generic closing message.
            channel.name = "Closing Channel";
            channel.purpose = "A channel that is in the process of closing";
          } else {
            channel.status = "Unknown";
          }

          if (channel.name === "" && !channel.initiator) {
            channel.name = "Inbound Channel";
            channel.purpose = "A channel that another node has opened to you";
          }

          /*
        // Set placeholder values if autopilot
        if (channel.managed === false && channel.initiator) {
          channel.name = "Autopilot";
          channel.purpose = "Managed by autopilot";
        }*/

          channels.push(channel);
        });
        commit("setChannels", channels);
        commit("setBalance", {
          confirmed: confirmedBalance,
          pending: pendingBalance,
        });
        commit("setMaxReceive", maxReceive);
        commit("setMaxSend", maxSend);
      }
    },

    async getTransactions({ commit, state, rootState }) {
      // Get invoices and payments
      const invoices =
        await rootState.citadel.middleware.lnd.lightning.invoices();
      const payments =
        await rootState.citadel.middleware.lnd.lightning.getPayments();

      if (!invoices || !payments) {
        return;
      }

      let transactions: (IncomingTransaction | OutgoingTransaction)[] = [];
      let incomingTransactions: IncomingTransaction[] = [];
      let outgoingTransactions: OutgoingTransaction[] = [];

      if (invoices) {
        incomingTransactions = invoices.map((tx) => {
          let type: "incoming" | "expired" | "pending" = "incoming";
          if (tx.state === Invoice_InvoiceState.CANCELED) {
            type = "expired";
          } else if (tx.state === Invoice_InvoiceState.OPEN) {
            type = "pending";
          }
          return {
            type,
            amount: Number(tx.value),
            timestamp:
              tx.state === Invoice_InvoiceState.SETTLED
                ? new Date(Number(tx.settleDate) * 1000)
                : new Date(Number(tx.creationDate) * 1000),
            description: tx.memo || "",
            expiresOn: new Date(
              (Number(tx.creationDate) + Number(tx.expiry)) * 1000
            ),
            paymentRequest: tx.paymentRequest,
          };
        });
        transactions = [...incomingTransactions];
      }

      if (payments) {
        outgoingTransactions = payments.map((tx) => {
          //load tx from state to copy description
          const preFetchedTx = state.transactions.find(
            (trx) =>
              trx.type === "outgoing" &&
              trx.paymentPreImage === tx.paymentPreimage
          );

          return {
            type: "outgoing",
            amount: Number(tx.valueSat),
            timestamp: new Date(Number(tx.creationTimeNs) * 1000),
            paymentRequest: tx.paymentRequest,
            paymentPreImage: tx.paymentPreimage,
            fee: Number(tx.feeSat),
            description: preFetchedTx
              ? (preFetchedTx as { description: string }).description
              : "",
          };
        });

        transactions = [...transactions, ...outgoingTransactions];
      }

      //Sort by recent to oldest
      transactions.sort((tx1, tx2) => {
        return Number(tx2.timestamp) - Number(tx1.timestamp);
      });

      //filter out new outgoing payments
      const newOutgoingTransactions = outgoingTransactions.filter(
        (tx) =>
          !(state.transactions as CustomTransactionType[]).some(
            (trx) => trx.paymentPreImage === tx.paymentPreImage
          )
      );

      //update $store
      commit("setTransactions", transactions);

      // Fetch descriptions of all new outgoing transactions
      for (const tx of newOutgoingTransactions) {
        if (!tx.paymentRequest) {
          //example - in case of a keysend tx there is no payment request
          continue;
        }

        try {
          const invoiceDetails =
            await rootState.citadel.middleware.lnd.lightning.parsePaymentRequest(
              tx.paymentRequest
            );
          if (invoiceDetails) {
            //load state's txs
            const updatedTransactions =
              state.transactions as CustomTransactionType[];

            //find tx to update
            const txIndex = updatedTransactions.findIndex(
              (trx) => trx.paymentPreImage === tx.paymentPreImage
            );

            if (txIndex !== -1) {
              //const outgoingTx = updatedTransactions[txIndex];
              //update tx description and state
              //outgoingTx.description = invoiceDetails.description;
              commit("setTransactions", transactions);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    },

    async getLndConnectUrls({ commit, rootState }) {
      const urls = await rootState.citadel.manager.system.getLndConnectUrls();
      if (urls) {
        commit("setLndConnectUrls", urls);
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
        if (state.unlocked) {
          data.class = "active";
          data.text = "Active";
        } else {
          data.class = "inactive";
          data.text = "Locked";
        }
      }

      return data;
    },
  },
};

export default {
  namespaced: true,
  ...lightningModule,
};
