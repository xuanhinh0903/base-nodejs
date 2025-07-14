import hre from 'hardhat';

async function main() {
  console.log('🚀 Starting contract deployment...');

  // Get signers
  const [deployer] = await hre.ethers.getSigners();
  console.log('📝 Deploying contracts with account:', deployer.address);

  // Deploy ClothingNFT contract first
  console.log('📦 Deploying ClothingNFT contract...');
  const ClothingNFT = await hre.ethers.getContractFactory('ClothingNFT');
  const nftContract = await ClothingNFT.deploy();
  await nftContract.waitForDeployment();

  const nftAddress = await nftContract.getAddress();
  console.log('✅ ClothingNFT deployed to:', nftAddress);

  // Deploy ClothingShop contract with NFT contract address
  console.log('🏪 Deploying ClothingShop contract...');
  const ClothingShop = await hre.ethers.getContractFactory('ClothingShop');
  const shopContract = await ClothingShop.deploy(nftAddress);
  await shopContract.waitForDeployment();

  const shopAddress = await shopContract.getAddress();
  console.log('✅ ClothingShop deployed to:', shopAddress);

  // Grant MINTER_ROLE to ClothingShop contract
  console.log('🔐 Granting MINTER_ROLE to ClothingShop...');
  const MINTER_ROLE = await nftContract.MINTER_ROLE();
  await nftContract.grantRole(MINTER_ROLE, shopAddress);
  console.log('✅ MINTER_ROLE granted to ClothingShop');

  // Verify deployment
  console.log('\n📋 Deployment Summary:');
  console.log('   ClothingNFT:', nftAddress);
  console.log('   ClothingShop:', shopAddress);
  console.log('   Deployer:', deployer.address);

  // Test basic functionality
  console.log('\n🧪 Testing basic functionality...');

  // Test adding a product
  const productName = 'Test T-Shirt';
  const productDescription = 'A test product for verification';
  const productPrice = hre.ethers.parseEther('0.01'); // 0.01 ETH
  const imageUrl = 'https://example.com/test-image.jpg';
  const category = 1; // 1 = t-shirts
  const stock = 10;

  console.log('📝 Adding test product...');
  const addProductTx = await shopContract.addProduct(
    productName,
    productDescription,
    productPrice,
    imageUrl,
    category,
    stock,
  );
  await addProductTx.wait();
  console.log('✅ Test product added successfully');

  // Get the product ID from the event
  const receipt = await hre.ethers.provider.getTransactionReceipt(
    addProductTx.hash,
  );
  const event = shopContract.interface.parseLog(receipt.logs[0]);
  const productId = event.args[0];
  console.log('   Product ID:', productId.toString());

  // Test getting product info
  const product = await shopContract.getProduct(productId);
  console.log('   Product Name:', product.name);
  console.log(
    '   Product Price:',
    hre.ethers.formatEther(product.price),
    'ETH',
  );

  console.log('\n🎉 Deployment and testing completed successfully!');
  console.log('\n💡 Next steps:');
  console.log('   1. Update your .env file with contract addresses');
  console.log('   2. Update blockchain.service.js with new addresses');
  console.log('   3. Test the API endpoints');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
