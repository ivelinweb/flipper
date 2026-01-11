require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

async function verifyDeployment() {
    console.log('=== Verifying Contract Deployment ===\n');
    
    // Read deployed addresses
    const deployedAddresses = JSON.parse(fs.readFileSync(path.join(__dirname, 'deployed-addresses.json'), 'utf8'));
    
    console.log('Deployed Contracts:');
    console.log('Donation:', deployedAddresses.Donation);
    console.log('PostFactory:', deployedAddresses.PostFactory);
    console.log('Network:', deployedAddresses.network);
    console.log('Chain ID:', deployedAddresses.chainId);
    console.log('Deployed At:', deployedAddresses.deployedAt);
    
    // Connect to Mantle Testnet
    const provider = new ethers.providers.JsonRpcProvider('https://5003.rpc.thirdweb.com');
    
    // Verify Donation contract
    console.log('\n--- Verifying Donation Contract ---');
    const donationABI = JSON.parse(fs.readFileSync(path.join(__dirname, 'build/contracts/Donation.json'), 'utf8')).abi;
    const donationContract = new ethers.Contract(deployedAddresses.Donation, donationABI, provider);
    
    try {
        const donationCode = await provider.getCode(deployedAddresses.Donation);
        if (donationCode === '0x') {
            console.error('❌ Donation contract not found at address');
            return false;
        }
        console.log('✅ Donation contract is deployed and has code');
        
        // Try to read from the contract
        try {
            const owner = await donationContract.owner();
            console.log('✅ Donation contract owner:', owner);
        } catch (e) {
            console.log('⚠️  Could not read owner (may not have owner function)');
        }
    } catch (error) {
        console.error('❌ Error verifying Donation contract:', error.message);
        return false;
    }
    
    // Verify PostFactory contract
    console.log('\n--- Verifying PostFactory Contract ---');
    const postFactoryABI = JSON.parse(fs.readFileSync(path.join(__dirname, 'build/contracts/PostFactory.json'), 'utf8')).abi;
    const postFactoryContract = new ethers.Contract(deployedAddresses.PostFactory, postFactoryABI, provider);
    
    try {
        const postFactoryCode = await provider.getCode(deployedAddresses.PostFactory);
        if (postFactoryCode === '0x') {
            console.error('❌ PostFactory contract not found at address');
            return false;
        }
        console.log('✅ PostFactory contract is deployed and has code');
        
        // Try to read from the contract
        try {
            const owner = await postFactoryContract.owner();
            console.log('✅ PostFactory contract owner:', owner);
        } catch (e) {
            console.log('⚠️  Could not read owner (may not have owner function)');
        }
    } catch (error) {
        console.error('❌ Error verifying PostFactory contract:', error.message);
        return false;
    }
    
    // Verify network
    console.log('\n--- Verifying Network ---');
    const network = await provider.getNetwork();
    console.log('✅ Connected to network:', network.name);
    console.log('✅ Chain ID:', network.chainId.toString());
    
    if (network.chainId.toString() !== deployedAddresses.chainId.toString()) {
        console.error('❌ Chain ID mismatch!');
        return false;
    }
    
    console.log('\n=== ✅ All Verifications Passed ===');
    console.log('\nContract addresses are ready to be used in the frontend.');
    console.log('Make sure to update frontend/.env.local with these addresses.');
    
    return true;
}

verifyDeployment()
    .then((success) => {
        process.exit(success ? 0 : 1);
    })
    .catch((error) => {
        console.error('Verification failed:', error);
        process.exit(1);
    });