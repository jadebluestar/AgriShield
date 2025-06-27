// src/config/wagmi.js
import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, polygonMumbai, hardhat } from 'wagmi/chains'
import { injected, metaMask, coinbaseWallet } from 'wagmi/connectors'

// ✅ Simple config without WalletConnect (perfect for school projects)
export const config = createConfig({
  chains: [mainnet, sepolia, polygonMumbai, hardhat],
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygonMumbai.id]: http(),
    [hardhat.id]: http(),
  },
})

// ✅ Contract Addresses organized per chain
export const CONTRACT_ADDRESSES = {
  [mainnet.id]: {
    carbonCredit: '0x...',   // TODO: Add real addresses
    farmerNFT: '0x...',
    weatherInsurance: '0x...',
  },
  [sepolia.id]: {
    carbonCredit: '0x168A477F2798945477C17cbF99484610810a6a25',
    farmerNFT: '0x700Ea8b631928D8803A4ff430A51D1400D17377c',
    weatherInsurance: '0x4819ce544C57184dAABce53bd202a647C417D87C',
  },
  [polygonMumbai.id]: {
    carbonCredit: '0x...',
    farmerNFT: '0x...',
    weatherInsurance: '0x...',
  },
  [hardhat.id]: {
    carbonCredit: '0x...',
    farmerNFT: '0x...',
    weatherInsurance: '0x...',
  },
}

// ✅ ABIs (modular)
export { FARMER_NFT_ABI, INSURANCE_ABI } from '../abi/farmerAndInsurance'
export { CARBON_CREDIT_ABI } from '../abi/carbon'