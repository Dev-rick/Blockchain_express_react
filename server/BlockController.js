import Block from './Block.js';
import Blockchain from './simpleChain.js';
import path from 'path';
import Mempool from './mempool.js';
// Require file system access
import fs from 'fs';
/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

  /**
   * Constructor to create a new BlockController, you need to initialize here all your endpoints
   * @param {*} app
   */
  constructor(app) {
    this.app = app;
    this.mempool = new Mempool();
    this.requestValidation();
    this.initializeMockData();
    this.getBlockByIndex();
    this.postNewBlock();
    this.messageSignatureValidation();
  }

  /**
   * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
   */

  requestValidation() {
    this.app.post('/requestValidation', (req, res) => {
      let address = req.body.address;
      this.mempool.functionWhichWillCreateARequestIfNoExists(address).then((responseFromMempool) => {
        console.log(responseFromMempool);
        res.send(responseFromMempool);
      });
    });
  }

  messageSignatureValidation() {
    this.app.post('/message-signature/validate', (req, res) => {
      let address = req.body.address;
      let signature = req.body.signature;
      this.mempool.funcionWhichWillValidateTheMessageAndRemovesItFromTheMempool(address, signature).then((response) => {
        res.send(response);
      });
    });
  }


  getBlockByIndex() {
    this.app.get('/api/block/:index', (req, res) => {
      let myBlockchain = new Blockchain();
      myBlockchain.getChain()
        .then((chain) => {
          if (req.params.index < chain.length) {
            myBlockchain.getBlock(req.params.index).then((block) => {
              console.log(block);
              return res.send(block);
            });
          } else {
            return res.send('Block not found');
          }
        });
    });
  }

  /**
   * Implement a POST Endpoint to add a new Block, url: "/api/block"
   */
  postNewBlock() {
    this.app.post('/block', (req, res) => {
      let myBlockchain = new Blockchain();
      let message = req.body.message
      // let jsonObject = req.body.address;
      // res.send(jsonObject);
      if (req.body.body === undefined || req.body.body.length === 0) {
        return res.send('No Body -> No Block Added');
      } else {
        console.log(message);
        let blockToAdd = new Block(message);
        myBlockchain.addBlock(blockToAdd)
          .then((blockToAdd) => {
            console.log(blockToAdd);
            return res.send(blockToAdd);
          });
      }
    });
  }

  /**
   * Help method to inizialized Mock dataset, adds 1 genesis block to levelDB
   */
  initializeMockData() {
    this.app.get('/', (req, res) => {
      return res.sendFile(path.join(__dirname + '/../README.md'));
    });
  }
}

/**
 * Exporting the BlockController class
 * @param {*} app
 */
module.exports = (app) => {
  return new BlockController(app);
};
