require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

async function deploy() {
    // Connect to Mantle Testnet
    const provider = new ethers.providers.JsonRpcProvider('https://5003.rpc.thirdweb.com');
    
    // Create wallet from private key
    const privateKey = process.env.MNEMONIC;
    const wallet = new ethers.Wallet(privateKey, provider);
    
    console.log('Deploying with account:', wallet.address);
    
    // Get balance
    const balance = await provider.getBalance(wallet.address);
    console.log('Account balance:', ethers.utils.formatEther(balance), 'MNT');
    
    // Read contract ABIs
    const donationABI = JSON.parse(fs.readFileSync(path.join(__dirname, 'build/contracts/Donation.json'), 'utf8')).abi;
    const donationBytecode = JSON.parse(fs.readFileSync(path.join(__dirname, 'build/contracts/Donation.json'), 'utf8')).bytecode;
    
    const postFactoryABI = JSON.parse(fs.readFileSync(path.join(__dirname, 'build/contracts/PostFactory.json'), 'utf8')).abi;
    const postFactoryBytecode = JSON.parse(fs.readFileSync(path.join(__dirname, 'build/contracts/PostFactory.json'), 'utf8')).bytecode;
    
    // Deploy Donation contract
    console.log('\nDeploying Donation contract...');
    const donationFactory = new ethers.ContractFactory(donationABI, donationBytecode, wallet);
    const donationContract = await donationFactory.deploy();
    await donationContract.deployed();
    const donationAddress = donationContract.address;
    console.log('Donation contract deployed to:', donationAddress);
    
    // Deploy PostFactory contract
    console.log('\nDeploying PostFactory contract...');
    const postFactoryContractFactory = new ethers.ContractFactory(postFactoryABI, postFactoryBytecode, wallet);
    const postFactoryContract = await postFactoryContractFactory.deploy();
    await postFactoryContract.deployed();
    const postFactoryAddress = postFactoryContract.address;
    console.log('PostFactory contract deployed to:', postFactoryAddress);
    
    // Save deployed addresses
    const deployedAddresses = {
        Donation: donationAddress,
        PostFactory: postFactoryAddress,
        network: 'mantleSepolia',
        chainId: 5003,
        deployedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(
        path.join(__dirname, 'deployed-addresses.json'),
        JSON.stringify(deployedAddresses, null, 2)
    );
    
    console.log('\n=== Deployment Summary ===');
    console.log('Donation:', donationAddress);
    console.log('PostFactory:', postFactoryAddress);
    console.log('Network: Mantle Sepolia (Chain ID: 5003)');
    console.log('Deployed addresses saved to deployed-addresses.json');
}

deploy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Deployment failed:', error);
        process.exit(1);
    });