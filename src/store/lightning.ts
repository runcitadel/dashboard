import type { Channel } from "@runcitadel/sdk";
type Channel_extended = Channel & {
  type?: string;
};
import { defineStore } from "pinia";
import { toPrecision } from "../helpers/units";
import useSdkStore from "./sdk";

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
  numPeers: number;
  channels:
    | [
        { type: "loading" },
        { type: "loading" },
        { type: "loading" },
        { type: "loading" }
      ]
    | ParsedChannel[];
  connectionCode: string;
  maxSend: number;
  maxReceive: number;
  transactions: (CustomTransactionType | { type: "loading" })[];
  confirmedTransactions: [];
  pendingTransactions: [];
  sdkStore: ReturnType<typeof useSdkStore>;
}
export type ParsedChannel = Channel & {
  type?: string | undefined;
  status:
    | "Online"
    | "Offline"
    | "Opening"
    | "Closing"
    | "Unknown"
    | "WAITING_CLOSING_CHANNEL"
    | "FORCE_CLOSING_CHANNEL"
    | "PENDING_OPEN_CHANNEL";
  name: string;
  purpose: string;
};

export default defineStore("lightning", {
  // Initial state
  state: (): State => ({
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
    sdkStore: useSdkStore(),
  }),
  actions: {
    async getStatus() {
      const status =
        await this.sdkStore.citadel.middleware.lnd.info.getStatus();
      if (status) {
        this.operational = status.operational;
        this.unlocked = status.unlocked;
      }
    },

    async getSync() {
      const sync = await this.sdkStore.citadel.middleware.lnd.info.syncStatus();
      if (sync && sync.percent) {
        this.percent = Number(toPrecision(parseFloat(sync.percent) * 100, 2));
        this.blockHeight = sync.knownBlockCount;
        this.currentBlock = sync.processedBlocks;
      }
    },

    //basically fetches everything
    async getLndPageData() {
      const data = await this.sdkStore.citadel.middleware.pages.lightning();
      const versionInfo =
        await this.sdkStore.citadel.middleware.lnd.info.version();

      if (data) {
        const channels = data.channels || [];
        await this.getChannels(channels);

        const lightningInfo = data.lightningInfo;

        this.alias = lightningInfo.alias;
        this.uris = lightningInfo.uris;
        this.pubkey = lightningInfo.identityPubkey;
        this.version = lightningInfo.version;
        this.numPeers = parseInt(lightningInfo.numPeers.toString());
        this.numActiveChannels = parseInt(
          lightningInfo.numActiveChannels.toString()
        );
      }

      if (versionInfo) {
        this.version = versionInfo.version;
        this.implementation = versionInfo.implementation;
      }
    },

    async getVersionInfo() {
      const versionInfo =
        await this.sdkStore.citadel.middleware.lnd.info.version();

      if (versionInfo) {
        this.version = versionInfo.version;
        this.implementation = versionInfo.implementation;
      }
    },

    async getConnectionCode() {
      const uris = await this.sdkStore.citadel.middleware.lnd.info.publicUris();

      if (uris && uris.length > 0) {
        this.connectionCode = uris[0];
      } else {
        this.connectionCode = "Could not determine lnd connection code";
      }
    },

    async getChannels(preFetchedChannels: Channel[] = []) {
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
        rawChannels = await this.sdkStore.citadel.middleware.lnd.channel.list();
      }

      const channels: ParsedChannel[] = [];
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

          channels.push(channel as ParsedChannel);
        });
        this.channels = channels;
        this.balance = {
          total: confirmedBalance + pendingBalance,
          confirmed: confirmedBalance,
          pending: pendingBalance,
        };
        this.maxReceive = maxReceive;
        this.maxSend = maxSend;
      }
    },

    async getTransactions() {
      // Get invoices and payments
      const invoices =
        await this.sdkStore.citadel.middleware.lnd.lightning.invoices();
      const payments =
        await this.sdkStore.citadel.middleware.lnd.lightning.getPayments();

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
              // @ts-expect-error TODO: Investigate this
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
          const preFetchedTx = this.transactions.find(
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
          !(this.transactions as CustomTransactionType[]).some(
            (trx) => trx.paymentPreImage === tx.paymentPreImage
          )
      );

      //update $store
      this.transactions = transactions as CustomTransactionType[];

      // Fetch descriptions of all new outgoing transactions
      for (const tx of newOutgoingTransactions) {
        if (!tx.paymentRequest) {
          //example - in case of a keysend tx there is no payment request
          continue;
        }

        try {
          const invoiceDetails =
            await this.sdkStore.citadel.middleware.lnd.lightning.parsePaymentRequest(
              tx.paymentRequest
            );
          if (invoiceDetails) {
            //load state's txs
            const updatedTransactions = this
              .transactions as CustomTransactionType[];

            //find tx to update
            const txIndex = updatedTransactions.findIndex(
              (trx) => trx.paymentPreImage === tx.paymentPreImage
            );

            if (txIndex !== -1) {
              //const outgoingTx = updatedTransactions[txIndex];
              //update tx description and state
              //outgoingTx.description = invoiceDetails.description;
              this.transactions = transactions as CustomTransactionType[];
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    },

    async getLndConnectUrls() {
      const urls =
        await this.sdkStore.citadel.manager.system.getLndConnectUrls();
      if (urls) {
        this.lndConnectUrls = urls;
      }
    },
  },
  getters: {
    status() {
      const data = {
        class: "loading",
        text: "Loading...",
      };

      if (this.operational) {
        if (this.unlocked) {
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
});
