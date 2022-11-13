import {defineStore, acceptHMRUpdate} from 'pinia';
import useSdkStore from './sdk';
import currencyHelper, {type Currency} from 'iso-country-currency';

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
  currency: string;
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

const useBitcoinStore = defineStore('bitcoin', {
  // Initial state
  state: (): State => {
    let countryInfo: Currency | undefined;
    try {
      countryInfo = currencyHelper.getAllInfoByISO(
        navigator.language.split('-')[1],
      );
    } catch {
      console.warn('Failed to get currency information');
    }

    return {
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
      currency: countryInfo?.currency || 'USD',
    };
  },

  // Functions to get data from the API
  actions: {
    async getStatus() {
      const sdkStore = useSdkStore();
      const status = await sdkStore.citadel.bitcoin.isAvailable();

      if (status) {
        this.operational = status;
      }
    },

    async getP2PInfo() {
      const sdkStore = useSdkStore();
      const p2pInfo = await sdkStore.citadel.bitcoin.p2pConnectionDetails();

      if (p2pInfo) {
        this.p2p = {
          ...p2pInfo,
          port: p2pInfo.port.toString(),
        };
      }
    },

    async getElectrumInfo() {
      const sdkStore = useSdkStore();
      const electrumInfo = await sdkStore.citadel.electrum.connectionDetails();

      if (electrumInfo) {
        this.electrum = {
          ...electrumInfo,
          port: electrumInfo.port.toString(),
        };
      }
    },

    async getRpcInfo() {
      const sdkStore = useSdkStore();
      const rpcInfo = await sdkStore.citadel.bitcoin.rpcConnectionDetails();

      if (rpcInfo) {
        this.rpc = {
          ...rpcInfo,
          port: rpcInfo.port.toString(),
        };
      }
    },

    async getSync() {
      const sdkStore = useSdkStore();
      const chain = await sdkStore.citadel.bitcoin.chain();
      const max_header = await sdkStore.citadel.bitcoin.chainHeight();

      if (chain) {
        this.percent =
          Number(chain.blocks / (max_header === 0 ? 1 : max_header)) * 100;
        this.currentBlock = chain.blocks;
        this.blockHeight = chain.headers;
        this.chain = chain.chain;
      }
    },

    async getBlocks() {
      const sdkStore = useSdkStore();
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
      const latestThreeBlocks = await sdkStore.citadel.bitcoin.blocks(
        currentBlock - 2,
        currentBlock,
      );

      // Update blocks
      this.blocks = latestThreeBlocks;
    },

    async getVersion() {
      const sdkStore = useSdkStore();
      const version = await sdkStore.citadel.bitcoin.version();

      if (version) {
        this.version = version;
      }
    },

    async getPeers() {
      const sdkStore = useSdkStore();
      const peers = await sdkStore.citadel.bitcoin.connections();

      if (peers) {
        this.peers = peers;
      }
    },

    async getStats() {
      const sdkStore = useSdkStore();
      const stats = await sdkStore.citadel.bitcoin.stats();

      if (stats) {
        const peers = stats.networkInfo.connections;
        const mempool = stats.mempoolInfo.size;
        const hashrate = stats.miningInfo.networkhashps;
        const blockchainSize = stats.blockchainInfo.size_on_disk;

        this.stats = {
          peers,
          mempool,
          hashrate,
          blockchainSize,
        };
      }
    },

    async getBalance() {
      const sdkStore = useSdkStore();
      const balance = await sdkStore.citadel.lightning.wallet.onChainBalance();

      this.balance = {
        total: parseInt(balance.totalBalance.toString()),
        pending: parseInt(balance.unconfirmedBalance.toString()),
        confirmed: parseInt(balance.confirmedBalance.toString()),
      };
    },

    async getTransactions() {
      const sdkStore = useSdkStore();
      const transactions =
        await sdkStore.citadel.lightning.transaction.getOnChainTransactions();
      this._transactions = transactions;
    },

    async getPrice() {
      const sdkStore = useSdkStore();
      const price = await sdkStore.citadel.external.price(this.currency);

      if (price) {
        this.price = price;
      }
    },

    async getDepositAddress() {
      const sdkStore = useSdkStore();
      const {address} = await sdkStore.citadel.lightning.address();

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
      const sdkStore = useSdkStore();
      const fees = await sdkStore.citadel.lightning.transaction.estimateFeeAll(
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
