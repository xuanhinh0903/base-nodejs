# Node.js Basic API

#Guide to installing packages for blockchain development

## Packages cần cài đặt cho Local Development

### 1. Core Blockchain Packages (Bắt buộc)

#### `ethers`

```bash
npm install ethers
```

**Lý do:** Thư viện chính để tương tác với blockchain local
**Sử dụng:** Kết nối Hardhat network, deploy contracts, gửi transactions

#### `@openzeppelin/contracts`

```bash
<code_block_to_apply_changes_from>
```

**Lý do:** Thư viện chuẩn cho NFT smart contracts
**Sử dụng:** ERC-721, ERC-1155, Access Control

### 2. Hardhat Development Tools (Bắt buộc)

#### `@nomicfoundation/hardhat-ethers`

```bash
npm install @nomicfoundation/hardhat-ethers
```

**Lý do:** Tích hợp ethers với Hardhat
**Sử dụng:** Testing, deployment, console interaction

### 3. Optional Packages (Khuyến nghị)

#### `@nomicfoundation/hardhat-verify`

```bash
npm install @nomicfoundation/hardhat-verify
```

**Lý do:** Verify contracts (chỉ cần khi deploy lên testnet)
**Sử dụng:** Verify smart contracts trên Etherscan

#### `ipfs-http-client`

```bash
npm install ipfs-http-client
```

**Lý do:** Lưu trữ metadata NFT
**Sử dụng:** Upload metadata lên IPFS

## Lệnh cài đặt tất cả cho Local:

```bash
# Cài đặt core packages cho local development
npm install ethers @openzeppelin/contracts @nomicfoundation/hardhat-ethers

# Cài đặt optional packages
npm install @nomicfoundation/hardhat-verify ipfs-http-client
```

## Kiểm tra sau khi cài đặt:

### 1. Kiểm tra Hardhat Network

```bash
# Khởi động local blockchain
npx hardhat node
```

### 2. Kiểm tra ethers connection

```javascript
// test-local.js
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
const blockNumber = await provider.getBlockNumber();
console.log('Connected to local network, block:', blockNumber);
```

### 3. Kiểm tra OpenZeppelin

```javascript
// test-contracts.js
import { ethers } from 'ethers';

// Test ERC-721
const ERC721 = await ethers.getContractFactory('ERC721');
console.log('OpenZeppelin contracts loaded successfully');
```

## Cấu hình cho Local Development:

### 1. Cập nhật hardhat.config.cjs

```javascript
require('@nomicfoundation/hardhat-ethers');
require('dotenv').config();

module.exports = {
  solidity: '0.8.28',
  networks: {
    // Local network
    hardhat: {
      chainId: 1337,
      accounts: {
        mnemonic:
          'test test test test test test test test test test test test junk',
        count: 10,
      },
    },
    // Local network với port khác
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 1337,
    },
  },
};
```

### 2. Tạo script test local

```javascript
// scripts/test-local.js
const hre = require('hardhat');

async function main() {
  console.log('🧪 Testing local setup...');

  // Get signers
  const [owner, buyer] = await hre.ethers.getSigners();
  console.log('✅ Signers loaded:', owner.address, buyer.address);

  // Test network connection
  const blockNumber = await hre.ethers.provider.getBlockNumber();
  console.log('✅ Connected to local network, block:', blockNumber);

  console.log('🎉 Local setup is working!');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
```

## Thứ tự thực hiện cho Local:

### Bước 1: Cài đặt packages

```bash
npm install ethers @openzeppelin/contracts @nomicfoundation/hardhat-ethers
```

### Bước 2: Cấu hình Hardhat

```bash
# Cập nhật hardhat.config.cjs
```

### Bước 3: Khởi động local network

```bash
npx hardhat node
```

### Bước 4: Test setup

```bash
npx hardhat run scripts/test-local.js --network localhost
```

### Bước 5: Deploy contracts

```bash
npx hardhat run scripts/deploy.js --network localhost
```

## Lưu ý quan trọng cho Local:

1. **Không cần testnet ETH** - Hardhat tạo sẵn accounts với 10000 ETH
2. **Không cần gas fees** - Local network không tính phí
3. **Reset mỗi lần restart** - Dữ liệu sẽ mất khi restart
4. **Fast transactions** - Giao dịch confirm ngay lập tức
5. **Easy debugging** - Có thể debug smart contracts dễ dàng

Bạn có muốn tôi bắt đầu với việc cài đặt các packages này không?

DB_USER=admin
DB_HOST=localhost
DB_NAME=nodejs-basic
DB_PASSWORD=123456
DB_PORT=5432
PORT=3000
INFURA_API_KEY=c0fc408825f945e191a16b7cf93e093c
PRIVATE_KEY=+jQ8QDbqNKjPqbPO/6vCNAgV2vKZJtfV7xycheP0nSgm3ExqDRWIwQ
