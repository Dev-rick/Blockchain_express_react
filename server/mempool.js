import Request from './Request.js';
import MempoolValid from './MempoolValid.js';
import bitcoinMessage from 'bitcoinjs-message';


class Mempool {
  constructor() {
    this.mempoolRegistry = []; //saves the whole request
    this.mempoolRegistryOnlyAddresses = []; //exists only for a faster check if request is still in the mempoolRegistry
    this.mempoolValidRegistry = []; //if not in here the time to validate (validationWindow) has not yet expired
    this.mempoolValidRegistryOnlyAdresses = []; //exists only for a faster check if request is still in the mempoolValidRegistry
  }
  functionWhichWillCreateARequestIfNoExists(address) {
    return new Promise((resolve) => {
      if (!this.mempoolRegistryOnlyAddresses.includes(address)) {
        let request = new Request(address);
        this.mempoolRegistryOnlyAddresses.push(address);
        this.mempoolRegistry.push(request);
        setTimeout(function(address) {
          this.makeRequestInvalidInMempoolRegistry(address)
        }, 5 * 60 * 1000);
        resolve(request);
      } else {
        for (let request of this.mempoolRegistry) {
          if (request.walletAddress === address) {
            this.updateValidationWindow(request, false);
            resolve(request);
          }
        }
      }
    });
  }

  makeRequestInvalidInMempoolValidRegistry(address) {
    this.mempoolValidRegistry.forEach(mempoolValid => {
      if (mempoolValid.status.address === address) {
        let indexTwo = this.mempoolValidRegistry.indexOf(mempoolValid);
        this.mempoolValidRegistry.splice(indexTwo, 1);
      }
    });
    let indexOne = this.mempoolValidRegistryOnlyAdresses.indexOf(address);
    this.mempoolValidRegistryOnlyAdresses.splice(indexOne, 1);
  }

  makeRequestInvalidInMempoolRegistry(address) {
    this.mempoolRegistry.forEach(request => {
      if (request.status.address === address) {
        let indexTwo = this.mempoolRegistry.indexOf(request);
        this.mempoolRegistry.splice(indexTwo, 1);
      }
    });
    let indexOne = this.mempoolRegistryOnlyAdresses.indexOf(address);
    this.mempoolRegistryOnlyAdresses.splice(indexOne, 1);
  }

  verifyAddressRequest(address) {
  return this.mempoolValidRegistryOnlyAdresses.includes(address) ? true : false;
  }

  updateValidationWindow(request, alreadyInMempoolValidRegistry) {
    if (!alreadyInMempoolValidRegistry) {
      const mempoolRegistryWindowTime = 5 * 60 * 10;
      const timestampOfRequest = request.timestamp;
      let timeElapse = (new Date().getTime().toString().slice(0, -3)) - timestampOfRequest;
      let timeLeft = (mempoolRegistryWindowTime / 1000) - timeElapse;
      request.validationWindow = timeLeft;
    } else {
      const mempoolValidRegistryWindowTime = 30 * 60 * 10;
      const timestampOfRequest = request.status.requestTimeStamp;
      let timeElapse = (new Date().getTime().toString().slice(0, -3)) - timestampOfRequest;
      let timeLeft = (mempoolValidRegistryWindowTime / 1000) - timeElapse;
      request.status.validationWindow = timeLeft;
    }
  }
  funcionWhichWillValidateTheMessageAndRemovesItFromTheMempool(address, signature) {
    return new Promise((resolve) => {
      if (this.mempoolRegistryOnlyAddresses.includes(address) === false) {
        resolve('Please first create a request at localhost:8000/requestValidation and then sign this message');
      } else {
        this.mempoolRegistry.forEach(request => {
          if (request.walletAddress === address) {
            this.updateValidationWindow(request, false);
            console.log('Still valid to be signed as validation window is over zero');
            try {
              let isValid = bitcoinMessage.verify(request.message, address, signature);
              if (isValid) {
                this.makeRequestInvalidInMempoolRegistry(address)
                let mempoolValid = new MempoolValid(request.walletAddress, request.timestamp, request.message, request.validationWindow, true);
                this.mempoolValidRegistryOnlyAdresses.push(address);
                this.mempoolValidRegistry.push(mempoolValid);
                setTimeout(function(address) {
                  this.makeRequestInvalidInMempoolValidRegistry(address)
                }, 30 * 60 * 1000);
                console.log(JSON.stringify(mempoolValid) + '\n\nYou are granted access to store a star\n\n');
                resolve(mempoolValid);
              } else {
                console.log('Signature does not correspond to the message');
                resolve('Signature does not correspond to the message');
              }
            } catch (err) {
              console.log('the signature is invalid');
              resolve('the signature is invalid');
            }
          }
        });
      }
    });
  }

}


export default Mempool;
