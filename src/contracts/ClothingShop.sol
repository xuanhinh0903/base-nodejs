// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ClothingNFT.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ClothingShop is AccessControl {
    ClothingNFT public nftContract;
    
    // Mapping từ productId đến thông tin sản phẩm
    mapping(uint256 => ShopProduct) public products;
    mapping(uint256 => bool) public productExists;
    
    // Thêm mảng lưu productIds
    uint256[] public productIds;
    
    // Role cho admin
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    struct ShopProduct {
        string name;
        string description;
        uint256 price;
        string imageUrl;
        uint256 category;
        bool isAvailable;
        uint256 stock;
    }
    
    event ProductAdded(uint256 productId, string name, uint256 price);
    event ProductPurchased(uint256 productId, address buyer, uint256 tokenId);
    event ProductUpdated(uint256 productId, string name, uint256 price);
    
    constructor(address _nftContract) {
        nftContract = ClothingNFT(_nftContract);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    // Thêm sản phẩm mới
    function addProduct(
        string memory name,
        string memory description,
        uint256 price,
        string memory imageUrl,
        uint256 category,
        uint256 stock
    ) public onlyRole(ADMIN_ROLE) returns (uint256) {
        uint256 productId = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, name)));
        
        products[productId] = ShopProduct({
            name: name,
            description: description,
            price: price,
            imageUrl: imageUrl,
            category: category,
            isAvailable: true,
            stock: stock
        });
        
        productExists[productId] = true;
        // Lưu productId vào mảng
        productIds.push(productId);
        
        emit ProductAdded(productId, name, price);
        return productId;
    }

    function deleteProduct(uint256 productId) public onlyRole(ADMIN_ROLE) {
        require(productExists[productId], "Product does not exist");
        delete products[productId];
        productExists[productId] = false;
        // Xóa productId khỏi mảng
        for (uint256 i = 0; i < productIds.length; i++) {
            if (productIds[i] == productId) {
                productIds[i] = productIds[productIds.length - 1];
                productIds.pop();
                break;
            }
        }
    }
    
    // Mua sản phẩm và mint NFT
    function purchaseProduct(uint256 productId) public payable returns (uint256) {
        require(productExists[productId], "Product does not exist");
        require(products[productId].isAvailable, "Product is not available");
        require(products[productId].stock > 0, "Product out of stock");
        require(msg.value >= products[productId].price, "Insufficient payment");
        
        // Giảm stock
        products[productId].stock--;
        
        // Mint NFT cho người mua
        uint256 tokenId = nftContract.mintNFT(
            msg.sender,
            products[productId].imageUrl, // TokenURI
            products[productId].name,
            _getCategoryName(products[productId].category),
            products[productId].price,
            "M", // Default size
            "Black" // Default color
        );
        
        emit ProductPurchased(productId, msg.sender, tokenId);
        return tokenId;
    }
    
    // Get product info
    function getProduct(uint256 productId) public view returns (ShopProduct memory) {
        require(productExists[productId], "Product does not exist");
        return products[productId];
    }
    
    // Update product (chỉ admin)
    function updateProduct(
        uint256 productId,
        string memory name,
        string memory description,
        uint256 price,
        string memory imageUrl,
        uint256 category,
        uint256 stock
    ) public onlyRole(ADMIN_ROLE) {
        require(productExists[productId], "Product does not exist");
        
        products[productId] = ShopProduct({
            name: name,
            description: description,
            price: price,
            imageUrl: imageUrl,
            category: category,
            isAvailable: products[productId].isAvailable,
            stock: stock
        });
        
        emit ProductUpdated(productId, name, price);
    }
    
    // Withdraw funds (chỉ admin)
    function withdraw() public onlyRole(ADMIN_ROLE) {
        payable(msg.sender).transfer(address(this).balance);
    }
    
    // Get contract balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    // Get all product IDs
    function getAllProductIds() public view returns (uint256[] memory) {
        return productIds;
    }
    
    // Get product IDs by page with offset and limit
    function getProductIdsByPage(uint256 offset, uint256 limit) public view returns (uint256[] memory) {
        uint256 total = productIds.length;

        if (offset >= total) {
            return new uint256[](0);
        }

        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }

        uint256[] memory result = new uint256[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = productIds[i];
        }

        return result;
    }
    
    // Helper function to convert category number to string
    function _getCategoryName(uint256 categoryId) internal pure returns (string memory) {
        if (categoryId == 1) return "t-shirts";
        if (categoryId == 2) return "tops";
        if (categoryId == 3) return "bottoms";
        if (categoryId == 4) return "dresses";
        if (categoryId == 5) return "outerwear";
        if (categoryId == 6) return "activewear";
        if (categoryId == 7) return "accessories";
        if (categoryId == 8) return "footwear";
        if (categoryId == 9) return "underwear";
        if (categoryId == 10) return "swimwear";
        if (categoryId == 11) return "formal-wear";
        if (categoryId == 12) return "casual-wear";
        if (categoryId == 13) return "vintage";
        if (categoryId == 14) return "streetwear";
        if (categoryId == 15) return "luxury";
        return "unknown";
    }
    
    // Override required by AccessControl
    function supportsInterface(bytes4 interfaceId) public view override(AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
} 