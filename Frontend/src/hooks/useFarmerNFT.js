// src/hooks/useContracts.js
import { 
  useWriteContract, 
  useReadContract, 
  useWaitForTransactionReceipt, 
  useChainId 
} from 'wagmi';
import { CONTRACT_ADDRESSES, FARMER_NFT_ABI } from '../config/wagmi';

// -------------------------------
// ✅ FarmerNFT Hook (Wagmi v2 Updated)
// -------------------------------
export const useFarmerNFT = () => {
  const chainId = useChainId();
  const CONTRACT_ADDRESS = CONTRACT_ADDRESSES[chainId]?.farmerNFT;

  const {
    data: nftHash,
    error: nftError,
    isPending: nftPending,
    writeContract
  } = useWriteContract();

  // ✅ Updated: register farmer with new Wagmi v2 pattern
  const registerFarmer = async (to, name, location, cropType) => {
    try {
      const farmerData = {
        name,
        location,
        cropType,
        farmerAddress: to,
        registrationDate: new Date().toISOString(),
        type: "FarmerNFT"
      };

      const jsonString = JSON.stringify(farmerData);
      const base64 = btoa(jsonString);
      const tokenUri = `data:application/json;base64,${base64}`;

      if (!CONTRACT_ADDRESS) {
        throw new Error('Contract address not found for current chain');
      }

      // ✅ New Wagmi v2 syntax
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: FARMER_NFT_ABI,
        functionName: 'mintNft',
        args: [tokenUri]
      });

    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // ✅ Updated: Check NFT balance with new hook
  const useHasNFT = (address) => {
    return useReadContract({
      address: CONTRACT_ADDRESS,
      abi: FARMER_NFT_ABI,
      functionName: 'balanceOf',
      args: [address],
      query: {
        enabled: !!address && !!CONTRACT_ADDRESS,
        refetchInterval: 5000, // Replaces 'watch: true'
      }
    });
  };

  // ✅ Updated: Get total NFTs minted
  const useTokenCounter = () => {
    return useReadContract({
      address: CONTRACT_ADDRESS,
      abi: FARMER_NFT_ABI,
      functionName: 'getTokenCounter',
      query: {
        enabled: !!CONTRACT_ADDRESS,
        refetchInterval: 5000,
      }
    });
  };

  return {
    registerFarmer,
    useHasNFT,
    useTokenCounter,
    nftHash,
    nftError,
    nftPending
  };
};

// ✅ Transaction status hook (unchanged - this one is still valid)
export const useTransactionStatus = (hash) => {
  return useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash
    }
  });
};