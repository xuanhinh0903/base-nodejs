/* eslint-env node */
const hre = require('hardhat');

async function main() {
  console.log('🚀 Starting deployment...');

  // Deploy ClothingNFT contract
  console.log('📦 Deploying ClothingNFT contract...');
  const ClothingNFT = await hre.ethers.getContractFactory('ClothingNFT');
  const nftContract = await ClothingNFT.deploy();
  await nftContract.waitForDeployment();

  const nftAddress = await nftContract.getAddress();
  console.log('✅ ClothingNFT deployed to:', nftAddress);

  // Deploy ClothingShop contract
  console.log('🏪 Deploying ClothingShop contract...');
  const ClothingShop = await hre.ethers.getContractFactory('ClothingShop');
  const shopContract = await ClothingShop.deploy(nftAddress);
  await shopContract.waitForDeployment();

  const shopAddress = await shopContract.getAddress();
  console.log('✅ ClothingShop deployed to:', shopAddress);

  // Grant minting permission to shop contract
  console.log('🔐 Granting minting permission to shop...');
  const mintRole = await nftContract.MINTER_ROLE();
  await nftContract.grantRole(mintRole, shopAddress);
  console.log('✅ Minting permission granted!');

  console.log('🎉 Deployment completed!');
  console.log('📋 Contract addresses:');
  console.log('   ClothingNFT:', nftAddress);
  console.log('   ClothingShop:', shopAddress);

  // Test: Add a sample product
  console.log('🧪 Adding sample product...');
  const addProductTx = await shopContract.addProduct(
    'Cool T-Shirt',
    'A very cool t-shirt',
    hre.ethers.parseEther('0.01'),
    'https://example.com/tshirt.jpg',
    'T-Shirts',
    10,
  );
  await addProductTx.wait();
  console.log('✅ Sample product added!');

  console.log('🎯 Ready for testing!');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
