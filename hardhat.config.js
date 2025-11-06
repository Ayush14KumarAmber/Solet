require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');
require('solidity-coverage');

const {
  RPC_URL = '',
  PRIVATE_KEY = '',
  ETHERSCAN_API_KEY = ''
} = process.env;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: false
    }
  },
  paths: {
    tests: 'tests'
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: RPC_URL || '',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY || ''
  },
  mocha: {
    timeout: 120000
  }
};


