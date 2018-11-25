import Block from './Block.js';
import Blockchain from './Blockchain.js';
import path from 'path';
import Mempool from './Mempool.js';
import BlockDecoded from './BlockDecoded';
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
    this.myBlockchain = new Blockchain();
    this.requestValidation();
    this.initializeMockData();
    this.getBlockByIndex();
    this.postNewBlock();
    this.messageSignatureValidation();
    this.getBlockByTheHash();
    this.getBlocksByTheWalletAddress();
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
    this.app.get('/block/:index', (req, res) => {
      if (req.params.index < 0 || isNaN(req.params.index)) {
        return res.send('Please enter a valid height');
      } else {
        this.myBlockchain.getChain()
          .then((chain) => {
            if (req.params.index > chain.length - 1) {
              return res.send('Block not found');
            } else {
              this.myBlockchain.getBlockByHeight(req.params.index).then((block) => {
                if (block.height === 0) {
                  // Genesis Block does not need to be decoded.
                  console.log(block);
                  return res.send(block);
                } else {
                  const blockDecoded = new BlockDecoded(block);
                  console.log(blockDecoded);
                  return res.send(blockDecoded);
                }
              });
            }
          });
      }
    });
  }

  getBlockByTheHash() {
    this.app.get('/stars/hash:hash', (req, res) => {
      const hash =  req.params.hash.slice(1)
      this.myBlockchain.getChain()
        .then((chain) => {
          if (hash < 0 || hash > chain.length) {
            return res.send('Block not found');
          } else {
            this.myBlockchain.getBlockByHash(hash).then((block) => {
              if (block.height === 0) {
                // Genesis Block does not need to be decoded.
                console.log(block);
                return res.send(block);
              } else {
                const blockDecoded = new BlockDecoded(block);
                console.log(blockDecoded);
                return res.send(blockDecoded);
              }
              })
              .catch((err) => {
                return res.send(err);
              });
          }
        });
    });
  }

  getBlocksByTheWalletAddress() {
    this.app.get('/stars/address:address', (req, res) => {
      const address = req.params.address.slice(1);
      this.myBlockchain.getChain()
        .then((chain) => {
          if (address < 0 || address > chain.length) {
            return res.send('Block not found');
          } else {
            this.myBlockchain.getBlocksByWalletAddress(address).then((arrayOfBlocks) => {
                const outputOfBlocks = [];
                arrayOfBlocks.forEach(block => {
                  if (block.height === 0) {
                    outputOfBlocks.push(block);
                  } else {
                    outputOfBlocks.push(new BlockDecoded(block));
                  }
                });
                console.log(outputOfBlocks);
                return res.send(outputOfBlocks);
              })
              .catch((err) => {
                return res.send(err);
              });
          }
        });
    });
  }

  /**
   * Implement a POST Endpoint to add a new Block, url: "/api/block"
   */
  postNewBlock() {
    this.app.post('/block', (req, res) => {
      const maxBytesForStory = 500;
      const isASCII = ((str) => /^[\x00-\x7F]*$/.test(str));
      const body = req.body;
      const address = body.address;
      const star = body.star;
      // checks if body is not empty
      if (!star) {
        return res.send('Pleasy fill in the star parameter');
      }
      // checks if an address was entered
      if (!address) {
        return res.send('Pleasy fill in the address');
      }
      //checks if address has a valid request in mempoolValidRegistry
      if (!this.mempool.verifyAddressRequest(address)) {
        return res.send('There is no request.\n\nPlease make first a request at localhost:8000/requestValidation and then sign this message');
      }
      //checks if only one star is in the request
      let output = [];
      for (let key in body) {
        if (body.hasOwnProperty(key)) {
          if (output.includes(key)) {
            res.send('please only save one star!');
          } else {
            output.push(key);
          }
        }
      }
      // checks if property are strings of the star parameters and if they are not empty
      const {
        dec,
        ra,
        story
      } = star;
      if (typeof dec !== 'string' || typeof ra !== 'string' || typeof story !== 'string' || !dec.length || !ra.length || !story.length) {
        return res.send('Your star information should include non-empty string properties \'dec\', \'ra\' and \'story\'');
      }
      // checks how long the story is
      if (Buffer.from(story).length > maxBytesForStory) {
        return res.send('The story you entered is too long. Maximum size is 500 bytes');
      }
      //checks if only ASCII characters were used
      if (!isASCII(story)) {
        return res.send('Please only use ASCII symbols');
      }
      body.star = {
        dec: star.dec,
        ra: star.ra,
        story: Buffer.from(story).toString('hex'),
        mag: star.mag,
        con: star.con
      };
      this.mempool.makeRequestInvalidInMempoolValidRegistry(address);
      let blockToAdd = new Block(body);
      this.myBlockchain.addBlock(blockToAdd)
        .then((blockToAddString) => {
          const blockToAddObject = JSON.parse(blockToAddString);
          const blockDecoded = new BlockDecoded(blockToAddObject);
          console.log(blockDecoded);
          return res.send(blockDecoded);
        })
        .catch((err) => {
          res.send(JSON.stringify(err));
          console.log(err);
        });
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
