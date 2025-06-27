import { useState, useEffect } from "react";
import { ethers } from "ethers";
import WI from "../abi/WeatherInsurance.json";

const ADDR = "0xYourInsuranceAddr";

export function useInsurance() {
  const [account, setAcc] = useState("");
  const [contract, setC] = useState();
  const [policy, setPolicy] = useState();
  const [rainfall, setRain] = useState();

  useEffect(() => {
    if (window.ethereum) {
      const p = new ethers.providers.Web3Provider(window.ethereum);
      p.send("eth_requestAccounts").then(async () => {
        const s = p.getSigner();
        const a = await s.getAddress();
        setAcc(a);
        setC(new ethers.Contract(ADDR, WI.abi, s));
      });
    }
  }, []);

  const buy = async (coverageStr) => {
    const cv = ethers.utils.parseEther(coverageStr);
    await contract.createPolicy(cv, { value: cv.mul(100).div(10000) });
  };
  const fetchPolicy = async () => {
    const pol = await contract.policies(account);
    setPolicy(pol);
  };
  const checkRain = async () => {
    await contract.requestRainData("Bangalore");
  };
  const reloadRain = async () => {
    const mm = await contract.lastRainfall();
    setRain(mm.toString());
  };

  return { account, buy, fetchPolicy, policy, checkRain, rainfall: rainfall, reloadRain };
}
