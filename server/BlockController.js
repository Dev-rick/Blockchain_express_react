import SHA256 from 'crypto-js/sha256';
import Block from './Block.js'
import Blockchain from './simpleChain.js';

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
        this.blocks = [];
        this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
          this.app.get('/api/blocks/:index', (req, res) => {
            let myBlockchain = new Blockchain();
            myBlockchain.getBlock(req.params.index).then((block) => {
              console.log(block);
              res.send(block);
              resolve();
            });
            });
          }
    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
       this.app.post("/api/block", (req, res) => {
            let myBlockchain = new Blockchain();
            let message = req.body.message;
            if (req.body.message.length === 0){
              res.send("No Body -> No Block Added")
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
          return new Promise((resolve) => {
              let myBlockchain = new Blockchain();
          });
      };

}

/**
 * Exporting the BlockController class
 * @param {*} app
 */
module.exports = (app) => { return new BlockController(app);}
