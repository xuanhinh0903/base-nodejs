require('@nomicfoundation/hardhat-toolbox');
require('@nomicfoundation/hardhat-ethers');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.28',
  // Cấu hình đường dẫn contracts
  paths: {
    sources: './src/contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  networks: {
    // Local network (mặc định)
    hardhat: {
      chainId: 31337,
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
        count: 10,
      },
    },
    // Local network với port khác
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
    },
  },
};
