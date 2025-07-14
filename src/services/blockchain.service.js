import { ethers } from 'ethers';
import { createRequire } from 'module';
import pool from '../utils/db.js';
const require = createRequire(import.meta.url);
const ClothingNFT = require('../../artifacts/src/contracts/ClothingNFT.sol/ClothingNFT.json');
const ClothingShop = require('../../artifacts/src/contracts/ClothingShop.sol/ClothingShop.json');

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.nftContract = null;
    this.shopContract = null;
    this.initialize();
  }

  async initialize() {
    try {
      // Kết nối local Hardhat network
      this.provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

      // Tạo signer từ private key (sử dụng account #0)
      const privateKey =
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
      this.signer = new ethers.Wallet(privateKey, this.provider);

      console.log('✅ Blockchain service initialized');
      console.log('🔗 Connected to:', await this.provider.getNetwork());
      console.log('👤 Signer address:', this.signer.address);
    } catch (error) {
      console.error('❌ Failed to initialize blockchain service:', error);
    }
  }

  // Load existing contracts
  async loadContracts(nftAddress, shopAddress) {
    try {
      this.nftContract = new ethers.Contract(
        nftAddress,
        ClothingNFT.abi,
        this.signer,
      );
      this.shopContract = new ethers.Contract(
        shopAddress,
        ClothingShop.abi,
        this.signer,
      );

      console.log('✅ Contracts loaded successfully');
      console.log('NFT Contract:', nftAddress);
      console.log('Shop Contract:', shopAddress);
    } catch (error) {
      console.error('❌ Failed to load contracts:', error);
      throw error;
    }
  }

  // Get contract instances
  getContracts() {
    return {
      nft: this.nftContract,
      shop: this.shopContract,
    };
  }

  // Get signer address
  getSignerAddress() {
    return this.signer.address;
  }

  // Add product to shop
  async addProduct(productData) {
    try {
      const { name, description, price, imageUrl, category, stock } =
        productData;

      const tx = await this.shopContract.addProduct(
        name,
        description,
        ethers.parseEther(price.toString()),
        imageUrl,
        category,
        stock,
      );

      const receipt = await tx.wait();
      console.log('✅ Product added successfully');

      // Lấy productId từ event
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.shopContract.interface.parseLog(log);
          return parsed.name === 'ProductAdded';
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = this.shopContract.interface.parseLog(event);
        return {
          success: true,
          productId: parsed.args.productId.toString(),
          transactionHash: tx.hash,
        };
      }

      return {
        success: true,
        transactionHash: tx.hash,
      };
    } catch (error) {
      console.error('❌ Failed to add product:', error);
      throw error;
    }
  }

  async deleteProductBlockchain(productId) {
    try {
      const tx = await this.shopContract.deleteProduct(productId);
      const receipt = await tx.wait();
      if (receipt.status === 0) {
        throw new Error('Transaction failed');
      }
      console.log('✅ Product deleted successfully');
      return {
        success: true,
        transactionHash: tx.hash,
      };
    } catch (error) {
      console.error('❌ Failed to delete product:', error);
      throw error;
    }
  }

  // Purchase product
  async purchaseProduct(productId, buyerAddress, price) {
    try {
      const tx = await this.shopContract.purchaseProduct(productId, {
        value: ethers.parseEther(price.toString()),
      });

      const receipt = await tx.wait();
      console.log('✅ Product purchased successfully');

      // Lấy tokenId từ event
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.shopContract.interface.parseLog(log);
          return parsed.name === 'ProductPurchased';
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = this.shopContract.interface.parseLog(event);
        return {
          success: true,
          tokenId: parsed.args.tokenId.toString(),
          transactionHash: tx.hash,
        };
      }

      return {
        success: true,
        transactionHash: tx.hash,
      };
    } catch (error) {
      console.error('❌ Failed to purchase product:', error);
      throw error;
    }
  }

  // Get product info
  async getProduct(productId) {
    try {
      const product = await this.shopContract.getProduct(productId);
      return {
        name: product.name,
        description: product.description,
        price: ethers.formatEther(product.price),
        imageUrl: product.imageUrl,
        category: product.category,
        isAvailable: product.isAvailable,
        stock: product.stock.toString(),
      };
    } catch (error) {
      console.error('❌ Failed to get product:', error);
      throw error;
    }
  }

  // Get NFT info
  async getNFT(tokenId) {
    try {
      const owner = await this.nftContract.ownerOf(tokenId);
      const tokenURI = await this.nftContract.tokenURI(tokenId);
      const productInfo = await this.nftContract.getProductInfo(tokenId);

      return {
        tokenId: tokenId.toString(),
        owner: owner,
        tokenURI: tokenURI,
        productInfo: {
          name: productInfo.name,
          category: productInfo.category,
          price: ethers.formatEther(productInfo.price),
          size: productInfo.size,
          color: productInfo.color,
          isAvailable: productInfo.isAvailable,
        },
      };
    } catch (error) {
      console.error('❌ Failed to get NFT:', error);
      throw error;
    }
  }

  // Get user's NFTs
  async getUserNFTs(userAddress) {
    try {
      const totalSupply = await this.nftContract.totalSupply();
      const userNFTs = [];

      for (let i = 1; i <= totalSupply; i++) {
        try {
          const owner = await this.nftContract.ownerOf(i);
          if (owner.toLowerCase() === userAddress.toLowerCase()) {
            const nftInfo = await this.getNFT(i);
            userNFTs.push(nftInfo);
          }
        } catch (error) {
          console.log('🚀 ~ BlockchainService ~ getUserNFTs ~ error:', error);
          // Skip if token doesn't exist
          continue;
        }
      }

      return userNFTs;
    } catch (error) {
      console.error('❌ Failed to get user NFTs:', error);
      throw error;
    }
  }

  // Get all products with pagination
  async getAllProducts(limit = 10, offset = 0) {
    try {
      // Get product IDs by page from blockchain
      const productIds = await this.shopContract.getProductIdsByPage(
        offset,
        limit,
      );

      const products = [];

      for (const productId of productIds) {
        try {
          const product = await this.shopContract.getProduct(productId);
          const categoryTypeCode = product.category;
          const categoryName = await this.getCategoryName(categoryTypeCode);

          products.push({
            productId: productId.toString(),
            name: product.name,
            description: product.description,
            price: ethers.formatEther(product.price),
            imageUrl: product.imageUrl,
            category: categoryName,
            isAvailable: product.isAvailable,
            stock: Number(product.stock),
          });
        } catch (error) {
          console.error(`Failed to get product ${productId}:`, error);
          continue;
        }
      }

      return products;
    } catch (error) {
      console.error('❌ Failed to get all products:', error);
      throw error;
    }
  }

  // Get total number of products
  async getTotalProducts() {
    try {
      const productIds = await this.shopContract.getAllProductIds();
      return productIds.length;
    } catch (error) {
      console.error('❌ Failed to get total products:', error);
      throw error;
    }
  }

  async getCategoryName(typeCode) {
    try {
      const result = await pool.query(
        'SELECT name FROM categories WHERE type_code = $1',
        [typeCode],
      );
      if (result.rows.length > 0) {
        return result.rows[0].name;
      }
      return 'Unknown Category';
    } catch (error) {
      console.error('❌ Failed to get category name:', error);
      return 'Unknown Category'; // Return default instead of throwing
    }
  }
}

export default new BlockchainService();
