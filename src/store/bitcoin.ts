import {toPrecision} from '../helpers/units';
import {defineStore, acceptHMRUpdate} from 'pinia';
import useSdkStore from './sdk';

type BasicBlock = {
  hash: string;
  height: number;
  numTransactions: number;
  confirmations: number;
  time: number;
  size: number;
};

interface Transaction {
  /** The transaction hash */
  txHash: string;
  /** The transaction amount, denominated in satoshis */
  amount: number | string;
  /** The number of confirmations */
  numConfirmations: number | string;
  /** The hash of the block this transaction was included in */
  blockHash: string;
  /** The height of the block this transaction was included in */
  blockHeight: number | string;
  /** Timestamp of this transaction */
  timeStamp: number | string;
  /** Fees paid for this transaction */
  totalFees: number | string;
  /** Addresses that received funds for this transaction */
  destAddresses: string[];
  /** The raw transaction hex. */
  rawTxHex: string;
  /** A label that was optionally set on transaction broadcast. */
  label: string;
}

type Transaction_extended = Transaction & {
  type:
    | 'CHANNEL_OPEN'
    | 'CHANNEL_CLOSE'
    | 'PENDING_OPEN'
    | 'PENDING_CLOSE'
    | 'UNKNOWN'
    | 'ON_CHAIN_TRANSACTION_SENT'
    | 'ON_CHAIN_TRANSACTION_RECEIVED';
};

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
  };
  _transactions: ({type: 'loading'} | Transaction_extended)[];
  pending: [];
  price: number;
  fees: Record<
    string,
    {
      total: number | string;
      perByte: number | string;
      sweepAmount?: number;
      error?: boolean;
    }
  >;
  sdkStore: ReturnType<typeof useSdkStore>;
}

const useBitcoinStore = defineStore('bitcoin', {
  // Initial state
  state: (): State => ({
    operational: false,
    calibrating: false,
    version: '',
    ipAddress: '',
    onionAddress: '',
    p2p: {
      address: '',
      port: '',
      connectionString: '',
    },
    electrum: {
      address: '',
      port: '',
      connectionString: '',
    },
    rpc: {
      rpcuser: '',
      rpcpassword: '',
      address: '',
      port: '',
      connectionString: '',
    },
    currentBlock: 0,
    chain: '',
    blockHeight: 0,
    blocks: [],
    percent: -1, //for loading state
    depositAddress: '',
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
    },
    _transactions: [
      {type: 'loading'},
      {type: 'loading'},
      {type: 'loading'},
      {type: 'loading'},
    ],
    pending: [],
    price: 0,
    fees: {
      fast: {
        total: '--',
        perByte: '--',
        error: false,
      },
      normal: {
        total: '--',
        perByte: '--',
        error: false,
      },
      slow: {
        total: '--',
        perByte: '--',
        error: false,
      },
      cheapest: {
        total: '--',
        perByte: '--',
        error: false,
      },
    },
    sdkStore: useSdkStore(),
  }),

  // Functions to get data from the API
  actions: {
    async getStatus() {
      const status =
        await this.sdkStore.citadel.middleware.bitcoin.isOperational();

      if (status) {
        this.operational = status;
      }
    },

    async getP2PInfo() {
      const p2pInfo =
        await this.sdkStore.citadel.manager.system.getBitcoinP2PConnectionDetails();

      if (p2pInfo) {
        this.p2p = {
          ...p2pInfo,
          port: p2pInfo.port.toString(),
        };
      }
    },

    async getElectrumInfo() {
      const electrumInfo =
        await this.sdkStore.citadel.manager.system.getElectrumConnectionDetails();

      if (electrumInfo) {
        this.electrum = {
          ...electrumInfo,
          port: electrumInfo.port.toString(),
        };
      }
    },

    async getRpcInfo() {
      const rpcInfo =
        await this.sdkStore.citadel.manager.system.getBitcoinRPConnectionDetails();

      if (rpcInfo) {
        this.rpc = {
          ...rpcInfo,
          port: rpcInfo.port.toString(),
        };
      }
    },

    async getSync() {
      const sync = await this.sdkStore.citadel.middleware.bitcoin.syncStatus();

      if (sync) {
        this.percent = Number(
          toPrecision(parseFloat(sync.percent.toString()) * 100, 2),
        );
        this.currentBlock = sync.currentBlock;
        this.blockHeight = sync.headerCount;
        this.chain = sync.chain;
      }
    },

    async getBlocks() {
      await this.getSync();

      // Cache block height array of latest 3 blocks for loading view
      const currentBlock = this.currentBlock;

      // Don't fetch blocks if no new block has been found
      if (this.blocks.length && currentBlock === this.blocks[0]['height']) {
        return;
      }

      // Don't fetch blocks if < 3 blocks primarily because we don't have a UI
      // ready for a blockchain with < 3 blocks
      if (currentBlock < 3) {
        return;
      }

      //TODO: Fetch only new blocks
      const latestThreeBlocks =
        await this.sdkStore.citadel.middleware.bitcoin.blocks(
          currentBlock - 2,
          currentBlock,
        );

      // Update blocks
      this.blocks = latestThreeBlocks;
    },

    async getVersion() {
      const version = await this.sdkStore.citadel.middleware.bitcoin.version();

      if (version) {
        this.version = version;
      }
    },

    async getPeers() {
      const peers =
        await this.sdkStore.citadel.middleware.bitcoin.connections();

      if (peers) {
        this.peers = peers;
      }
    },

    async getStats() {
      const stats = await this.sdkStore.citadel.middleware.bitcoin.stats();

      if (stats) {
        const peers = stats.connections;
        const mempool = stats.mempool;
        const hashrate = stats.networkhashps;
        const blockchainSize = stats.size;

        this.stats = {
          peers,
          mempool,
          hashrate,
          blockchainSize,
        };
      }
    },

    async getBalance() {
      const balance =
        await this.sdkStore.citadel.middleware.lightning.wallet.onChainBalance();

      this.balance = {
        total: parseInt(balance.totalBalance.toString()),
        pending: parseInt(balance.unconfirmedBalance.toString()),
        confirmed: parseInt(balance.confirmedBalance.toString()),
      };
    },

    async getTransactions() {
      const transactions =
        await this.sdkStore.citadel.middleware.lightning.transaction.getOnChainTransactions();
      this._transactions = transactions;
    },

    async getPrice() {
      const price = await this.sdkStore.citadel.manager.external.price('USD');

      if (price) {
        this.price = price;
      }
    },

    async getDepositAddress() {
      const {address} =
        await this.sdkStore.citadel.middleware.lightning.address();

      if (address) {
        this.depositAddress = address;
      }
    },

    async getFees({
      address,
      amt,
      sweep,
    }: {
      address: string;
      amt: number;
      sweep?: boolean;
    }) {
      const fees =
        await this.sdkStore.citadel.middleware.lightning.transaction.estimateFeeAll(
          address,
          amt,
          sweep,
        );

      if (fees) {
        for (const [speed, estimate] of Object.entries(fees)) {
          this.fees[speed].total = estimate.feeSat;
          this.fees[speed].perByte = estimate.satPerVbyte;
          this.fees[speed].sweepAmount = estimate.sweepAmount;
          this.fees[speed].error = false;
        }
      }
    },
  },
  getters: {
    status() {
      const data = {
        class: 'loading',
        text: 'Loading...',
      };

      if (this.operational) {
        data.class = 'active';
        data.text = 'Operational';
      }

      return data;
    },
    transactions(): (
      | {
          type: 'incoming' | 'outgoing';
          amount: number | string;
          timestamp: Date;
          description: string;
          hash: string;
          confirmations: string | number;
        }
      | {type: 'loading'}
    )[] {
      const txs: {
        type: 'incoming' | 'outgoing';
        amount: number | string;
        timestamp: Date;
        description: string;
        hash: string;
        confirmations: string | number;
      }[] = [];

      //return default "loading" transactions until txs aren't fetched
      if (
        this._transactions &&
        this._transactions.length &&
        this._transactions[0]['type'] === 'loading'
      ) {
        return this._transactions as {type: 'loading'}[];
      }

      if (this._transactions) {
        (this._transactions as Transaction_extended[]).forEach(
          (tx: Transaction_extended) => {
            const amount = Number(tx.amount);

            let type: 'incoming' | 'outgoing' = 'incoming';
            if (amount < 0) {
              type = 'outgoing';
            } else if (amount === 0) {
              //skip self incoming txs of change
              return;
            }

            // if (tx.numConfirmations === 0) {

            // }
            // type = "pending";

            let description = 'Unknown';

            if (tx.type === 'CHANNEL_OPEN' || tx.type === 'PENDING_OPEN') {
              description = 'Lightning Wallet';
            } else if (
              tx.type === 'CHANNEL_CLOSE' ||
              tx.type === 'PENDING_CLOSE'
            ) {
              description = 'Lightning Wallet';
            } else if (tx.type === 'ON_CHAIN_TRANSACTION_SENT') {
              description = 'Withdrawal';
            } else if (tx.type === 'ON_CHAIN_TRANSACTION_RECEIVED') {
              description = 'Deposit';
            }

            txs.push({
              type,
              amount: amount < 0 ? amount * -1 : amount, //for formatting +/- in view
              timestamp: new Date(Number(tx.timeStamp) * 1000),
              description,
              hash: tx.txHash,
              confirmations: tx.numConfirmations,
            });
          },
        );

        // Sort txs by date
        txs.sort(function (tx1, tx2) {
          // @ts-expect-error Date - Date works in actual JS
          return tx2.timestamp - tx1.timestamp;
        });
      }

      return txs;
    },
  },
});

export default useBitcoinStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBitcoinStore, import.meta.hot));
}
