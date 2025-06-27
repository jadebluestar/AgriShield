import { useContractWrite, useContractRead, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { CONTRACT_ADDRESSES, FARMER_NFT_ABI } from '../config/wagmi';

// -------------------------------
// ✅ FarmerNFT Hook (Hybridized)
// -------------------------------
export const useFarmerNFT = () => {
  const chainId = useChainId();
  const CONTRACT_ADDRESS = CONTRACT_ADDRESSES[chainId]?.farmerNFT;

  const {
    data: nftHash,
    error: nftError,
    isLoading: nftPending,
    write: mintNftWrite
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: FARMER_NFT_ABI,
    functionName: 'mintNft',
  });

  // ✅ Modern pattern: register farmer with base64 JSON metadata
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

      if (!mintNftWrite) {
        throw new Error('mintNftWrite function not available');
      }

      mintNftWrite({
        args: [tokenUri]
      });

    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // ✅ Read: Check NFT balance
  const useHasNFT = (address) => {
    return useContractRead({
      address: CONTRACT_ADDRESS,
      abi: FARMER_NFT_ABI,
      functionName: 'balanceOf',
      args: [address],
      enabled: !!address && !!CONTRACT_ADDRESS,
      watch: true
    });
  };

  // ✅ Read: Get total NFTs minted (optional helper)
  const useTokenCounter = () => {
    return useContractRead({
      address: CONTRACT_ADDRESS,
      abi: FARMER_NFT_ABI,
      functionName: 'getTokenCounter',
      enabled: !!CONTRACT_ADDRESS,
      watch: true
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

// ✅ Generic transaction status hook
export const useTransactionStatus = (hash) => {
  return useWaitForTransactionReceipt({
    hash,
    enabled: !!hash
  });
};
