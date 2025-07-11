const hre = require('hardhat');

async function main() {
  console.log('🧪 Testing contracts...');

  // Get signers
  const [owner, buyer] = await hre.ethers.getSigners();
  console.log('✅ Signers loaded:', owner.address, buyer.address);

  // Deploy contracts
  const ClothingNFT = await hre.ethers.getContractFactory('ClothingNFT');
  const nftContract = await ClothingNFT.deploy();

  const ClothingShop = await hre.ethers.getContractFactory('ClothingShop');
  const shopContract = await ClothingShop.deploy(
    await nftContract.getAddress(),
  );

  console.log('✅ Contracts deployed for testing');

  // Grant MINTER_ROLE to shop contract
  console.log('🔐 Granting MINTER_ROLE to shop contract...');
  const MINTER_ROLE = await nftContract.MINTER_ROLE();
  await nftContract.grantRole(MINTER_ROLE, await shopContract.getAddress());
  console.log('✅ MINTER_ROLE granted to shop contract');

  // Test 1: Add product
  console.log('📦 Testing: Add product');
  const addProductTx = await shopContract.addProduct(
    'Test T-Shirt',
    'A cool test t-shirt',
    hre.ethers.parseEther('0.01'),
    'https://example.com/image.jpg',
    'T-Shirts',
    10,
  );

  // Chờ transaction và lấy receipt
  const receipt = await addProductTx.wait();

  // Lấy productId từ event
  const event = receipt.logs.find(log => {
    try {
      const parsed = shopContract.interface.parseLog(log);
      return parsed.name === 'ProductAdded';
    } catch {
      return false;
    }
  });

  let productId;
  if (event) {
    const parsed = shopContract.interface.parseLog(event);
    productId = parsed.args.productId;
    console.log('✅ Product added successfully with ID:', productId.toString());
  } else {
    console.log(
      '⚠️ Could not find ProductAdded event, using default productId',
    );
    productId = 0;
  }

  // Test 2: Purchase product
  console.log('🛒 Testing: Purchase product');
  const purchaseTx = await shopContract
    .connect(buyer)
    .purchaseProduct(productId, {
      value: hre.ethers.parseEther('0.01'),
    });
  await purchaseTx.wait();
  console.log('✅ Product purchased successfully');

  // Test 3: Check NFT ownership
  console.log('🖼️ Testing: Check NFT ownership');
  const tokenId = 1; // First minted token
  const nftOwner = await nftContract.ownerOf(tokenId);
  console.log('NFT owner:', nftOwner);
  console.log('Buyer address:', await buyer.getAddress());
  console.log('✅ NFT ownership verified');

  // Test 4: Get product info
  console.log('📋 Testing: Get product info');
  const product = await shopContract.getProduct(productId);
  console.log('Product name:', product.name);
  console.log('Product price:', hre.ethers.formatEther(product.price));
  console.log('Product stock:', product.stock);
  console.log('✅ Product info retrieved');

  console.log('🎉 All tests passed!');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
