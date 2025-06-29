// src/hooks/useWallet.js
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';

export const useWallet = () => {
  const { isConnected, address, chainId } = useAccount();
  const { connect, connectors, isLoading, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);

  // Reset connecting state when connection completes
  useEffect(() => {
    if (isConnected) {
      setIsConnecting(false);
    }
  }, [isConnected]);

  const connectWallet = async (connectorId) => {
    try {
      setIsConnecting(true);
      const connector = connectors.find(c => c.id === connectorId);
      if (connector) {
        await connect({ connector });
      }
    } catch (err) {
      console.error('Connection failed:', err);
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    disconnect();
    setIsConnecting(false);
  };

  // Auto-connect MetaMask if available
  const autoConnect = async () => {
    const metaMaskConnector = connectors.find(c => c.name === 'MetaMask');
    if (metaMaskConnector && !isConnected) {
      try {
        await connectWallet(metaMaskConnector.id);
      } catch (err) {
        console.log('Auto-connect failed:', err);
      }
    }
  };

  return {
    isConnected,
    address,
    chainId,
    connectors,
    isLoading: isLoading || isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    autoConnect,
  };
};