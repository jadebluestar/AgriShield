import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [connected, setConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const networks = {
    43113: {
      name: 'Avalanche Fuji',
      rpcUrl: 'https://avalanche-fuji.drpc.org',
      symbol: 'AVAX',
      explorer: 'https://testnet.snowtrace.io',
    },
    11155111: {
      name: 'Ethereum Sepolia',
      rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
      symbol: 'ETH',
      explorer: 'https://sepolia.etherscan.io',
    },
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const web3Instance = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const accounts = await web3Instance.eth.getAccounts();
      const networkId = await web3Instance.eth.getChainId();
      
      setWeb3(web3Instance);
      setAccount(accounts[0]);
      setChainId(Number(networkId));
      setConnected(true);
      
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('connectedAccount', accounts[0]);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWeb3(null);
    setAccount('');
    setConnected(false);
    setChainId(null);
    setError('');
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('connectedAccount');
  };

  const getCurrentNetwork = () => {
    return networks[chainId] || null;
  };

  const isCorrectNetwork = () => {
    return chainId === 43113 || chainId === 11155111;
  };

  // NFT-related functions
  const mintFarmerNFT = async (farmerData) => {
    if (!web3 || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      // Simulate NFT minting process
      const nftData = {
        tokenId: Date.now(),
        owner: account,
        metadata: {
          name: `${farmerData.name} - Farmer NFT`,
          description: `Farmer NFT for ${farmerData.name} from ${farmerData.location}`,
          image: farmerData.cropImage,
          attributes: [
            { trait_type: 'Location', value: farmerData.location },
            { trait_type: 'Crop Type', value: farmerData.cropType },
            { trait_type: 'Farming Method', value: farmerData.farmingMethod },
            { trait_type: 'Farm Size', value: `${farmerData.farmSize} acres` },
            { trait_type: 'Years of Experience', value: farmerData.yearsOfExperience },
          ],
        },
        createdAt: new Date().toISOString(),
      };

      // Store NFT data locally (in production, this would be on blockchain)
      localStorage.setItem(`farmerNFT_${account}`, JSON.stringify(nftData));
      
      return nftData;
    } catch (error) {
      console.error('NFT minting failed:', error);
      throw error;
    }
  };

  const getFarmerNFT = () => {
    if (!account) return null;
    const nftData = localStorage.getItem(`farmerNFT_${account}`);
    return nftData ? JSON.parse(nftData) : null;
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && localStorage.getItem('walletConnected')) {
        await connectWallet();
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
          localStorage.setItem('connectedAccount', accounts[0]);
        }
      });
      
      window.ethereum.on('chainChanged', (chainId) => {
        setChainId(parseInt(chainId, 16));
      });

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', () => {});
          window.ethereum.removeListener('chainChanged', () => {});
        }
      };
    }
  }, []);

  const value = {
    web3,
    account,
    connected,
    chainId,
    loading,
    error,
    networks,
    connectWallet,
    disconnectWallet,
    getCurrentNetwork,
    isCorrectNetwork,
    mintFarmerNFT,
    getFarmerNFT,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
