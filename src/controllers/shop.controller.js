import blockchainService from '../services/blockchain.service.js';

// Load contracts khi khởi động
const NFT_ADDRESS = '0x68B1D87F95878fE05B998F19b66F4baba5De1aed';
const SHOP_ADDRESS = '0x3Aa5ebB10DC797CAC828524e59A333d0A371443c';

// Initialize blockchain service
await blockchainService.loadContracts(NFT_ADDRESS, SHOP_ADDRESS);

// Add product
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, stock } = req.body;

    // Validate required fields
    if (!name || !description || !price || !imageUrl || !category || !stock) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const result = await blockchainService.addProduct({
      name,
      description,
      price,
      imageUrl,
      category,
      stock: parseInt(stock),
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product',
      error: error.message,
    });
  }
};

// Get product by ID
export const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const product = await blockchainService.getProduct(productId);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get product',
      error: error.message,
    });
  }
};

// Purchase product
export const purchaseProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { buyerAddress, price } = req.body;

    if (!productId || !buyerAddress || !price) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, buyer address, and price are required',
      });
    }

    const result = await blockchainService.purchaseProduct(
      productId,
      buyerAddress,
      price,
    );

    res.status(200).json({
      success: true,
      message: 'Product purchased successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error purchasing product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to purchase product',
      error: error.message,
    });
  }
};

// Get NFT by token ID
export const getNFT = async (req, res) => {
  try {
    const { tokenId } = req.params;

    if (!tokenId) {
      return res.status(400).json({
        success: false,
        message: 'Token ID is required',
      });
    }

    const nft = await blockchainService.getNFT(tokenId);

    res.status(200).json({
      success: true,
      data: nft,
    });
  } catch (error) {
    console.error('Error getting NFT:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get NFT',
      error: error.message,
    });
  }
};

// Get user's NFTs
export const getUserNFTs = async (req, res) => {
  try {
    const { userAddress } = req.params;

    if (!userAddress) {
      return res.status(400).json({
        success: false,
        message: 'User address is required',
      });
    }

    const nfts = await blockchainService.getUserNFTs(userAddress);

    res.status(200).json({
      success: true,
      data: nfts,
    });
  } catch (error) {
    console.error('Error getting user NFTs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user NFTs',
      error: error.message,
    });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await blockchainService.getAllProducts();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error getting all products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get all products',
      error: error.message,
    });
  }
};
