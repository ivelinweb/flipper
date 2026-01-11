import { ethers, Contract, BrowserProvider, JsonRpcProvider } from "ethers";
import CONTRACT_ADDRESSES from "../config/contracts";
import DonationABI from "../../contracts/build/contracts/Donation.json";
import PostFactoryABI from "../../contracts/build/contracts/PostFactory.json";
import ProfileImageFactoryABI from "../../contracts/build/contracts/ProfileImageFactory.json";

export const getDonationContract = (provider: any) => {
  const contractAddress = CONTRACT_ADDRESSES.Donation;
  return new Contract(contractAddress, DonationABI.abi, provider);
};

export const getPostFactoryContract = (provider: any) => {
  const contractAddress = CONTRACT_ADDRESSES.PostFactory;
  return new Contract(contractAddress, PostFactoryABI.abi, provider);
};

export const getProfileImageFactoryContract = (provider: any) => {
  const contractAddress = CONTRACT_ADDRESSES.ProfileImageFactory;
  return new Contract(contractAddress, ProfileImageFactoryABI.abi, provider);
};

export const getProvider = () => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    return new BrowserProvider((window as any).ethereum);
  }
  return new JsonRpcProvider(CONTRACT_ADDRESSES.rpcUrl);
};

export const getSigner = async () => {
  const provider = getProvider();
  if (provider instanceof BrowserProvider) {
    return provider.getSigner();
  }
  throw new Error("No signer available");
};

export default {
  getDonationContract,
  getPostFactoryContract,
  getProfileImageFactoryContract,
  getProvider,
  getSigner
};