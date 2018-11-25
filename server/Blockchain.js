/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
import {
  addLevelDBData,
  readLevelDBData,
  getLevelDBData,
  getLevelDBDataByHash,
  getLevelDBDataByWalletAddress
} from './levelSandbox';
import Block from './Block.js';



/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
  constructor() {
    this.chain = [];
    this.getChain().then((dataArray) => {
      if (dataArray.length === 0) {
        return this.createGenesisBlock(new Block('Genesis Block - I am the first block on the chain'))
          .then(() => {
            console.log('Genesis block addded');
          });
      } else {
        return;
      }
    });
  }
  //adding Genesis Block
  createGenesisBlock(genesisBlock) {
    if (this.chain.length === 0) {
      console.log('Adding the first Block - the Genesis Block!\n');
      genesisBlock.height = 0;
      genesisBlock.time = new Date().getTime().toString().slice(0, -3);
      genesisBlock.hash = SHA256(JSON.stringify(genesisBlock)).toString();
      console.log(genesisBlock);
      return addLevelDBData(this.chain.length, JSON.stringify(genesisBlock).toString()).then(() => {

      });
    } else {
      return;
    }
  }

  //getting the full chain
  getChain() {
    return readLevelDBData().then((dataArray) => {
      return new Promise((resolve, reject) => {
        this.chain = [];
        this.chain = dataArray;
        resolve(dataArray);
      });
    });
  }

  // Add new block
  addBlock(newBlock) {
    return this.getChain().then((dataArray) => {
      return new Promise((resolve, reject) => {
        if (dataArray.length > 0) {
          this.getBlockByHeight(dataArray.length - 1).then((requestedBlock) => {
            console.log('adding following block...\n');
            // UTC timestamp
            newBlock.time = new Date().getTime().toString().slice(0, -3);
            // Block height
            newBlock.height = dataArray.length;
            // previous block hash
            newBlock.previousBlockHash = requestedBlock.hash;
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            resolve(addLevelDBData(dataArray.length, JSON.stringify(newBlock)));
          });
        } else {
          console.log('Genesis Block is missing\n');
          return;
        }
      });
    });
  }

  // Get block height
  getBlockHeight() {
    return readLevelDBData().then((dataArray) => {
      return new Promise((resolve) => {
        this.chain = [];
        this.chain = dataArray;
        let height = this.chain.length;
        resolve(height);
      });
    });
  }

  // get block
  getBlockByHeight(blockHeight) {
    return new Promise((resolve) => {
      return getLevelDBData(blockHeight.toString()).then((value) => {
        let requestedBlock = JSON.parse(value);
        resolve(requestedBlock);
      });
    });
  }
  getBlockByHash(hash) {
    return new Promise((resolve, reject) => {
      return getLevelDBDataByHash(hash.toString()).then((keyOfBlock) => {
        if (!keyOfBlock) {
          reject('No block with this has found');
        } else {
          this.getBlockByHeight(keyOfBlock).then((requestedBlock) => {
            resolve(requestedBlock);
          });
        }
      });
    });
  }
  getBlocksByWalletAddress(address) {
    return new Promise((resolve, reject) => {
      return getLevelDBDataByWalletAddress(address.toString()).then((keysOfBlocks) => {
        if (!keysOfBlocks) {
          reject('No Blocks found with this wallet address');
        } else {
          let promiseArray = [];
          keysOfBlocks.forEach(key => {
            promiseArray.push(this.getBlockByHeight(key));
          });
          Promise.all(promiseArray).then((arrayOfBlocks) => {
            resolve(arrayOfBlocks);
          });
        }
      });
    });
  }
  // validate block
  validateBlock(blockHeight) {
    // get block object
    return this.getBlockByHeight(blockHeight).then((requestedBlock) => {
      return new Promise((resolve) => {
        // get block hash
        let blockHash = requestedBlock.hash;
        // remove block hash to test block integrity
        requestedBlock.hash = '';
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(requestedBlock)).toString();
        // Compare
        if (blockHash === validBlockHash) {
          console.log('Block #' + requestedBlock.height + ' is valid\n');
          resolve(true);
        } else {
          console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);
          resolve(false);
        }
      });
    });

  }

  //validate every block on the chain
  validateChain() {
    let PromiseArray = [];
    this.getChain().then((dataArray) => {
      console.log('Checking the content of block = his hash...\n');
      for (var i = 0; i <= dataArray.length - 1; i++) {
        PromiseArray.push(this.validateBlock(i));
      }
      Promise.all(PromiseArray)
        .then(() => {
          console.log('Now checking the chain...\n');
        })
        .then(() => {
          let promiseErrorLog = [];
          for (let i = 0; i < dataArray.length - 1; i++) {
            let myErrorPromise = new Promise((resolve, reject) => {
              let blockHash = '';
              let previousHash = '';
              this.getBlockByHeight(i).then((requestedBlock) => {
                previousHash = requestedBlock.hash;
              });
              this.getBlockByHeight(i + 1).then((requestedBlock) => {
                blockHash = requestedBlock.previousBlockHash;
                if (blockHash !== previousHash) {
                  reject(i);
                } else {
                  resolve();
                }
              });
            });
            promiseErrorLog.push(myErrorPromise);
          }
          Promise.all(promiseErrorLog)
            .then(() => {
              console.log('No errors detected');
            })
            .catch((errorLog) => {
              console.log('Block #' + errorLog + ' makes the chain invalid!\n');
            });
        });

    });

  }
}


export default Blockchain;
