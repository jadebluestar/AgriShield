import { useState, useEffect } from 'react';
import Web3 from 'web3';

export const useWallet = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [connected, setConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed');
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
    } catch (error) {
      setError('Failed to connect wallet');
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
        }
      });
      
      window.ethereum.on('chainChanged', (chainId) => {
        setChainId(parseInt(chainId, 16));
      });
    }
  }, []);

  return {
    web3,
    account,
    connected,
    chainId,
    loading,
    error,
    connectWallet,
    disconnectWallet,
  };
};
