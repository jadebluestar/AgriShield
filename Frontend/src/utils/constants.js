export const NETWORKS = {
  AVALANCHE_FUJI: {
    chainId: 43113,
    name: 'Avalanche Fuji',
    rpcUrl: 'https://avalanche-fuji.drpc.org',
    symbol: 'AVAX',
    explorer: 'https://testnet.snowtrace.io',
  },
  ETHEREUM_SEPOLIA: {
    chainId: 11155111,
    name: 'Ethereum Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    symbol: 'ETH',
    explorer: 'https://sepolia.etherscan.io',
  },
};

export const CONTRACT_ADDRESSES = {
  FARMER_REGISTRY: '0x...',
  WEATHER_INSURANCE: '0x...',
  CROSS_CHAIN_LENDING: '0x...',
  CARBON_CREDITS: '0x...',
};

export const API_ENDPOINTS = {
  ACCUWEATHER: 'https://dataservice.accuweather.com/forecasts/v1/daily/1day/',
  CHAINLINK_FUNCTIONS: 'https://functions.chain.link/',
};

export const THEME_COLORS = {
  PRIMARY: '#1a365d',
  SECONDARY: '#4a5568',
  SUCCESS: '#059669',
  WARNING: '#f59e0b',
  ERROR: '#dc2626',
  INFO: '#1a365d',
};
