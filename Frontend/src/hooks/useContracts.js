import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { parseEther } from 'viem'
import { CONTRACT_ADDRESSES, FARMER_NFT_ABI, INSURANCE_ABI } from '../config/wagmi'

// ----------------------------
// ✅ FarmerNFT Hook (Hybrid)
// ----------------------------
export const useFarmerNFT = () => {
  const chainId = useChainId();
  const FARMER_NFT_ADDRESS = CONTRACT_ADDRESSES[chainId]?.farmerNFT;

  const {
    writeContract: writeNFT,
    data: nftHash,
    error: nftError,
    isPending: nftPending
  } = useWriteContract();

  // ✅ Modern metadata pattern for minting
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
      const tokenUri = `data:application/json;utf8,${encodeURIComponent(jsonString)}`;

      await writeNFT({
        address: FARMER_NFT_ADDRESS,
        abi: FARMER_NFT_ABI,
        functionName: 'mintNft',
        args: [tokenUri],
      });

    } catch (error) {
      console.error('Error registering farmer:', error);
      throw error;
    }
  };

  // ✅ Read: check if address has NFT
  const useHasNFT = (address) => {
    return useReadContract({
      address: FARMER_NFT_ADDRESS,
      abi: FARMER_NFT_ABI,
      functionName: 'balanceOf',
      args: [address],
      enabled: !!address && !!FARMER_NFT_ADDRESS,
    });
  };

  // ✅ Read: get total NFT minted
  const useTokenCounter = () => {
    return useReadContract({
      address: FARMER_NFT_ADDRESS,
      abi: FARMER_NFT_ABI,
      functionName: 'getTokenCounter',
      enabled: !!FARMER_NFT_ADDRESS,
    });
  };

  return {
    registerFarmer,
    useHasNFT,
    useTokenCounter,
    nftHash,
    nftError,
    nftPending,
  };
};

// ----------------------------
// ✅ Insurance Hook (As-is)
// ----------------------------
export const useInsurance = () => {
  const chainId = useChainId();
  const INSURANCE_ADDRESS = CONTRACT_ADDRESSES[chainId]?.weatherInsurance;

  const {
    writeContract: writeInsurance,
    data: insuranceHash,
    error: insuranceError,
    isPending: insurancePending
  } = useWriteContract();

  const getInsurance = async (location, ethAmount) => {
    try {
      await writeInsurance({
        address: INSURANCE_ADDRESS,
        abi: INSURANCE_ABI,
        functionName: 'getInsurance',
        args: [location],
        value: parseEther(ethAmount.toString()),
      });
    } catch (error) {
      console.error('Error getting insurance:', error);
      throw error;
    }
  };

  const useInsuranceUsers = () => {
    return useReadContract({
      address: INSURANCE_ADDRESS,
      abi: INSURANCE_ABI,
      functionName: 'getInsuranceUsers',
      enabled: !!INSURANCE_ADDRESS,
    });
  };

  const useFarmerLocation = (address) => {
    return useReadContract({
      address: INSURANCE_ADDRESS,
      abi: INSURANCE_ABI,
      functionName: 'getFarmerLocation',
      args: [address],
      enabled: !!address && !!INSURANCE_ADDRESS,
    });
  };

  const useInsurancePeriod = (address) => {
    return useReadContract({
      address: INSURANCE_ADDRESS,
      abi: INSURANCE_ABI,
      functionName: 'getInsurancePeriod',
      args: [address],
      enabled: !!address && !!INSURANCE_ADDRESS,
    });
  };

  const useRainData = (address) => {
    return useReadContract({
      address: INSURANCE_ADDRESS,
      abi: INSURANCE_ABI,
      functionName: 'getAddressToRainData',
      args: [address],
      enabled: !!address && !!INSURANCE_ADDRESS,
    });
  };

  return {
    getInsurance,
    useInsuranceUsers,
    useFarmerLocation,
    useInsurancePeriod,
    useRainData,
    insuranceHash,
    insuranceError,
    insurancePending,
  };
};

// ----------------------------
// ✅ Generic Tx Status
// ----------------------------
export const useTransactionStatus = (hash) => {
  return useWaitForTransactionReceipt({
    hash,
    enabled: !!hash,
  });
};
