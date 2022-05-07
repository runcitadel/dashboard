import {toPrecision} from '../helpers/units';
import {defineStore} from 'pinia';
import useSdkStore from './sdk';

type BasicBlock = {
  hash: string;
  height: number;
  numTransactions: number;
  confirmations: number;
  time: number;
  size: number;
};

export interface State {
  operational: boolean;
  calibrating: boolean;
  version: string;
  ipAddress: string;
  onionAddress: string;
  currentBlock: number;
  chain: string;
  blockHeight: number;
  blocks: BasicBlock[];
  percent: number;
  depositAddress: string;
  stats: {
    peers: number;
    mempool: number;
    blockchainSize: number;
  };
  peers: {
    total: number;
    inbound: number;
    outbound: number;
  };
  pending: [];
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

export default defineStore('liquid', {
  // Initial state
  state: (): State => ({
    operational: false,
    calibrating: false,
    version: '',
    ipAddress: '',
    onionAddress: '',
    currentBlock: 0,
    chain: '',
    blockHeight: 0,
    blocks: [],
    percent: -1, //for loading state
    depositAddress: '',
    stats: {
      peers: -1,
      mempool: -1,
      blockchainSize: -1,
    },
    peers: {
      total: 0,
      inbound: 0,
      outbound: 0,
    },
    pending: [],
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
        await this.sdkStore.citadel.middleware.liquid.isOperational();

      if (status) {
        this.operational = status;
      }
    },

    async getSync() {
      const sync = await this.sdkStore.citadel.middleware.liquid.syncStatus();

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
        await this.sdkStore.citadel.middleware.liquid.blocks(
          currentBlock - 2,
          currentBlock,
        );

      // Update blocks
      this.blocks = latestThreeBlocks;
    },

    async getVersion() {
      const version = await this.sdkStore.citadel.middleware.liquid.version();

      if (version) {
        this.version = version;
      }
    },

    async getPeers() {
      const peers = await this.sdkStore.citadel.middleware.liquid.connections();

      if (peers) {
        this.peers = peers;
      }
    },

    async getStats() {
      const stats = await this.sdkStore.citadel.middleware.liquid.stats();

      if (stats) {
        const peers = stats.connections;
        const mempool = stats.mempool;
        const blockchainSize = stats.size;

        this.stats = {
          peers,
          mempool,
          blockchainSize,
        };
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
  },
});
