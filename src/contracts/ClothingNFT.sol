// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ClothingNFT is ERC721, AccessControl {
    // Thay thế Counters bằng uint256 đơn giản
    uint256 private _tokenIdCounter;
    
    // Mapping từ tokenId đến metadata
    mapping(uint256 => string) private _tokenURIs;
    
    // Mapping từ tokenId đến thông tin sản phẩm
    mapping(uint256 => ProductInfo) private _productInfo;
    
    // Role cho minting
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    struct ProductInfo {
        string name;
        string category;
        uint256 price;
        string size;
        string color;
        bool isAvailable;
    }
    
    event NFTMinted(uint256 tokenId, address owner, string tokenURI);
    event ProductInfoUpdated(uint256 tokenId, string name, uint256 price);
    
    constructor() ERC721("ClothingNFT", "CNFT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }
    
    // Mint NFT mới
    function mintNFT(
        address recipient,
        string memory uri, // Đổi tên để tránh shadowing
        string memory name,
        string memory category,
        uint256 price,
        string memory size,
        string memory color
    ) public onlyRole(MINTER_ROLE) returns (uint256) {
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        
        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, uri);
        
        _productInfo[newTokenId] = ProductInfo({
            name: name,
            category: category,
            price: price,
            size: size,
            color: color,
            isAvailable: true
        });
        
        emit NFTMinted(newTokenId, recipient, uri);
        return newTokenId;
    }
    
    // Set token URI
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        _tokenURIs[tokenId] = _tokenURI;
    }
    
    // Get token URI
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenURIs[tokenId];
    }
    
    // Get product info
    function getProductInfo(uint256 tokenId) public view returns (ProductInfo memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _productInfo[tokenId];
    }
    
    // Update product info (chỉ admin)
    function updateProductInfo(
        uint256 tokenId,
        string memory name,
        uint256 price,
        string memory size,
        string memory color
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        _productInfo[tokenId].name = name;
        _productInfo[tokenId].price = price;
        _productInfo[tokenId].size = size;
        _productInfo[tokenId].color = color;
        
        emit ProductInfoUpdated(tokenId, name, price);
    }
    
    // Get total supply
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    // Override required by AccessControl
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
} 