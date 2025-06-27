import Web3 from 'web3';
import { CONTRACT_ADDRESSES, NETWORKS } from '../../utils/constants';

class Web3Service {
  constructor() {
    this.web3 = null;
    this.account = null;
    this.contracts = {};
  }

  async initialize(provider) {
    this.web3 = new Web3(provider);
    const accounts = await this.web3.eth.getAccounts();
    this.account = accounts[0];
    return this.account;
  }

  async getBalance(address = this.account) {
    if (!this.web3) throw new Error('Web3 not initialized');
    const balance = await this.web3.eth.getBalance(address);
    return this.web3.utils.fromWei(balance, 'ether');
  }

  async getChainId() {
    if (!this.web3) throw new Error('Web3 not initialized');
    return await this.web3.eth.getChainId();
  }

  async switchNetwork(chainId) {
    if (!window.ethereum) throw new Error('MetaMask not found');
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      if (error.code === 4902) {
        await this.addNetwork(chainId);
      } else {
        throw error;
      }
    }
  }

  async addNetwork(chainId) {
    const network = Object.values(NETWORKS).find(n => n.chainId === chainId);
    if (!network) throw new Error('Network not supported');

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${chainId.toString(16)}`,
          chainName: network.name,
          rpcUrls: [network.rpcUrl],
          nativeCurrency: {
            name: network.symbol,
            symbol: network.symbol,
            decimals: 18,
          },
          blockExplorerUrls: [network.explorer],
        },
      ],
    });
  }

  formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  formatAmount(amount = 18) {
    return this.web3.utils.fromWei(amount.toString(), 'ether');
  }

  parseAmount(amount = 18) {
    return this.web3.utils.toWei(amount.toString(), 'ether');
  }
}

export default new Web3Service();
