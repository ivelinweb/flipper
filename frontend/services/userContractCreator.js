import { ethers } from "ethers";
import Contract from "../../contracts/build/contracts/ProfileImageFactory.json"
import CONTRACT_ADDRESSES from "../config/contracts";

// const provider = new ethers.providers.InfuraProvider('rinkeby2', INFURA_API_KEY);

const prepare = (provider) => {
    const contractAddress = CONTRACT_ADDRESSES.ProfileImageFactory;
    const contractABI = Contract.abi;
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    return contract;
}

export default async function createUserContract(provider){

    const contract = prepare(provider)

    const signer = await provider.getSigner();
    
    const contractWithSigner = contract.connect(signer);

    try{
        console.log("creating contract")
        const transaction = await contractWithSigner.createUserPhoto(60)
        transaction.wait();
        console.log("finished")
        console.log(transaction)
        return transaction;
    } catch (e) {
        console.log(e)
        return null;
    }
}
//   writeContractVariable();