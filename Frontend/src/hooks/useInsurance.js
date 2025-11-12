import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import addresses from "../config/local-addresses.json";
import { FARMER_NFT_ABI, SIMPLE_INSURANCE_ABI } from "../config/wagmi";

export function useInsurance() {
  const { address: account, isConnected } = useAccount();
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [nftContract, setNftContract] = useState();
  const [insuranceContract, setInsuranceContract] = useState();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      if (!window.ethereum || !isConnected) return;
      try {
        const p = new ethers.BrowserProvider(window.ethereum);
        const s = await p.getSigner();
        setProvider(p);
        setSigner(s);
        
        if (addresses?.farmerNFT) {
          setNftContract(new ethers.Contract(addresses.farmerNFT, FARMER_NFT_ABI, s));
        }
        if (addresses?.weatherInsurance) {
          setInsuranceContract(new ethers.Contract(addresses.weatherInsurance, SIMPLE_INSURANCE_ABI, s));
        }
      } catch (error) {
        console.error("Failed to initialize contracts:", error);
      }
    }
    init();
  }, [isConnected]);

  const fetchPolicies = useCallback(async () => {
    if (!insuranceContract || !account) return;
    try {
      setLoading(true);
      const list = await insuranceContract.getPolicies(account);
      setPolicies(list || []);
      setError("");
    } catch (e) {
      console.error("Failed to fetch policies:", e);
      setError("Failed to fetch policies");
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  }, [insuranceContract, account]);

  const createPolicy = useCallback(async (location, coverageEth) => {
    if (!insuranceContract || !signer || !nftContract) {
      setError("Contracts not initialized");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      // Check if farmer has NFT
      const balance = await nftContract.balanceOf(account);
      if (balance === 0n) {
        setError("You must register as a farmer first (mint NFT)");
        return;
      }
      
      const coverageAmount = ethers.parseEther(coverageEth.toString());
      const premium = (coverageAmount * 5n) / 100n; // 5% premium
      
      console.log(`Creating policy: location=${location}, coverage=${coverageEth} ETH, premium=${ethers.formatEther(premium)} ETH`);
      
      const tx = await insuranceContract.createPolicy(location, coverageAmount, { value: premium });
      console.log("Transaction sent:", tx.hash);
      
      await tx.wait();
      console.log("Policy created successfully");
      
      // Refresh policies
      await fetchPolicies();
    } catch (e) {
      console.error("Policy creation error:", e);
      setError(e.message || e.reason || "Policy creation failed");
    } finally {
      setLoading(false);
    }
  }, [insuranceContract, signer, account, nftContract, fetchPolicies]);

  const cancelPolicy = useCallback(async (policyId) => {
    if (!insuranceContract || policyId === undefined || policyId === null) {
      setError("Invalid policy ID");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      console.log(`Cancelling policy ID: ${policyId}`);
      
      const tx = await insuranceContract.cancelPolicy(policyId);
      console.log("Cancellation transaction sent:", tx.hash);
      
      await tx.wait();
      console.log("Policy cancelled successfully");
      
      // Refresh policies
      await fetchPolicies();
    } catch (e) {
      console.error("Policy cancellation error:", e);
      setError(e.message || e.reason || "Cancellation failed");
    } finally {
      setLoading(false);
    }
  }, [insuranceContract, fetchPolicies]);

  return {
    account,
    createPolicy,
    cancelPolicy,
    fetchPolicies,
    policies,
    loading,
    error,
    isConnected,
  };
}
