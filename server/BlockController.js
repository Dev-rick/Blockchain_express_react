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
        // this.app.get("/api/block/:index", (req, res) => {
          this.app.get('/api/blocks/:index', (req, res) => {
            return new Promise((resolve) => {
                let myBlockchain = new Blockchain();
                setTimeout(( function addNewBlock() {
                  myBlockchain.getBlock(req.params.index).then((block) => {
                    console.log(block);
                    res.send(block);
                    return block;
                  })
            }), 1000);
        });
    });
  }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/api/block", (req, res) => {
          res.send("HElloe");
            // Add your code here
        });

    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    initializeMockData() {
          return new Promise((resolve) => {
              let myBlockchain = new Blockchain();
              setTimeout(( function addNewBlock() {
                  // myBlockchain.getBlock(4).then((block) => {    // grab a block
                  //     block.hash = 'eddfd5e6c4f2101d110c09e00ee80d46e4b3dbc4bbdee6a1002fe461eae28026';  // parse as JSON
                  //     block.body = 'error';    // modify body
                  //     addLevelDBData(4, JSON.stringify(block));   // reinsert in the same position
                  // });
                  myBlockchain.getBlock(4).then((block) => {
                    console.log(block);
                    return block;
                  })
                  // myBlockchain.addBlock(new Block());
                  // setTimeout((function validateChain() {
                  //     myBlockchain.validateChain();
                  //     setTimeout((function logBlockChain() {
                  //         myBlockchain.getChain().then(() => {
                  //             console.log('Here is your blockchain...\n');
                  //             console.log(myBlockchain);
                  //
                  //         });
                  //     }), 1000);
                  // }), 1000);
              }), 1000);

          });
      };

        // if(this.blocks.length === 0){
        //     for (let index = 0; index < 10; index++) {
        //         let blockAux = new BlockClass.Block(`Test Data #${index}`);
        //         blockAux.height = index;
        //         blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
        //         this.blocks.push(blockAux);
        //     }
        // }

}

/**
 * Exporting the BlockController class
 * @param {*} app
 */
module.exports = (app) => { return new BlockController(app);}
