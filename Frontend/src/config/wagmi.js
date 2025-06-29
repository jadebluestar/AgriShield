// src/config/wagmi.js - Updated configuration
import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { metaMask, injected } from 'wagmi/connectors'

// ✅ MetaMask only configuration - prevents duplicate requests
export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    // Only MetaMask connector
    metaMask({
      dappMetadata: {
        name: 'AgriShield',
        description: 'Weather-based crop insurance platform',
      },
    }),
  ],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
  // Prevent multiple connector discovery
  multiInjectedProviderDiscovery: false,
})

// Alternative minimal config if above doesn't work
export const configMinimal = createConfig({
  chains: [sepolia],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
})

// Your existing contract addresses
export const CONTRACT_ADDRESSES = {
  [mainnet.id]: {
    carbonCredit: '0x...',
    farmerNFT: '0x...',
    weatherInsurance: '0x...',
  },
  [sepolia.id]: {
    carbonCredit: '0x168A477F2798945477C17cbF99484610810a6a25',
    farmerNFT: '0x700Ea8b631928D8803A4ff430A51D1400D17377c',
    weatherInsurance: '0x592Fcea4F58c6370F62F8705A19229c9CB055647',
  },
}

export { FARMER_NFT_ABI, INSURANCE_ABI } from '../abi/farmerAndInsurance'
export { CARBON_CREDIT_ABI } from '../abi/carbon'