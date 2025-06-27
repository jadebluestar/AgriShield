// src/hooks/useCarbonCredits.js

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CARBON_CREDIT_ABI, CARBON_CREDIT_ADDRESS, FARMER_NFT_ABI, FARMER_NFT_ADDRESS } from '../config/contracts';

export const useCarbonCredits = () => {
  const { address, isConnected } = useAccount();
  const [transactionStatus, setTransactionStatus] = useState('idle');

  // Contract write operations
  const { 
    writeContract, 
    data: hash, 
    error: writeError, 
    isPending: isWritePending 
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: confirmError
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Read user's carbon credit balance
  const { 
    data: carbonBalance, 
    refetch: refetchBalance,
    isLoading: isBalanceLoading 
  } = useReadContract({
    address: CARBON_CREDIT_ADDRESS,
    abi: CARBON_CREDIT_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address
  });

  // Read total supply
  const { 
    data: totalSupply,
    refetch: refetchTotalSupply 
  } = useReadContract({
    address: CARBON_CREDIT_ADDRESS,
    abi: CARBON_CREDIT_ABI,
    functionName: 'totalSupply',
    enabled: true
  });

  // Check if user has Farmer NFT
  const { 
    data: nftBalance,
    isLoading: isNftLoading 
  } = useReadContract({
    address: FARMER_NFT_ADDRESS,
    abi: FARMER_NFT_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address
  });

  // Read token name and symbol
  const { data: tokenName } = useReadContract({
    address: CARBON_CREDIT_ADDRESS,
    abi: CARBON_CREDIT_ABI,
    functionName: 'name'
  });

  const { data: tokenSymbol } = useReadContract({
    address: CARBON_CREDIT_ADDRESS,
    abi: CARBON_CREDIT_ABI,
    functionName: 'symbol'
  });

  // Mint carbon credits
  const mintCarbonCredits = async (area, cropType, practiceType) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }

    if (!nftBalance || nftBalance === 0n) {
      throw new Error('You need to register as a farmer first (mint Farmer NFT)');
    }

    setTransactionStatus('pending');

    try {
      await writeContract({
        address: CARBON_CREDIT_ADDRESS,
        abi: CARBON_CREDIT_ABI,
        functionName: 'mintBasedOnSavedCarbon',
        args: [
          BigInt(area),
          cropType,
          practiceType
        ]
      });
    } catch (error) {
      setTransactionStatus('error');
      throw error;
    }
  };

  // Update transaction status based on confirmation
  useEffect(() => {
    if (isWritePending) {
      setTransactionStatus('pending');
    } else if (isConfirming) {
      setTransactionStatus('confirming');
    } else if (isConfirmed) {
      setTransactionStatus('success');
      // Refetch balances after successful transaction
      refetchBalance();
      refetchTotalSupply();
    } else if (writeError || confirmError) {
      setTransactionStatus('error');
    }
  }, [isWritePending, isConfirming, isConfirmed, writeError, confirmError, refetchBalance, refetchTotalSupply]);

  // Reset transaction status
  const resetTransactionStatus = () => {
    setTransactionStatus('idle');
  };

  // Check if user is eligible (has NFT)
  const isEligible = nftBalance && nftBalance > 0n;

  // Calculate user's percentage of total supply
  const getUserPercentage = () => {
    if (!carbonBalance || !totalSupply || totalSupply === 0n) return 0;
    return (Number(carbonBalance) / Number(totalSupply)) * 100;
  };

  return {
    // Data
    carbonBalance,
    totalSupply,
    nftBalance,
    tokenName,
    tokenSymbol,
    
    // Status
    isConnected,
    isEligible,
    isBalanceLoading,
    isNftLoading,
    transactionStatus,
    
    // Errors
    error: writeError || confirmError,
    
    // Functions
    mintCarbonCredits,
    refetchBalance,
    refetchTotalSupply,
    resetTransactionStatus,
    getUserPercentage,
    
    // Transaction states
    isWritePending,
    isConfirming,
    isConfirmed
  };
};