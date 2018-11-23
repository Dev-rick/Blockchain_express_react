import Request from './request.js';
import MempoolValid from './mempoolValid.js';
import bitcoinMessage from 'bitcoinjs-message';


class Mempool {
  constructor() {
    this.mempoolRegistry = []; //saves the whole request
    this.timeoutRequests = []; //exists only for a faster check if request is still in the mempool
    this.mempoolValidRegistry = []; //if not in here the time to validate (validationWindow) has not yet expired
  }
  functionWhichWillCreateARequestIfNoExists(address) {
    return new Promise((resolve) => {
      if (this.timeoutRequests.includes(address) === false) {
        let request = new Request(address);
        this.timeoutRequests.push(address);
        this.mempoolRegistry.push(request);
        resolve(request);
      } else {
        for (let request of this.mempoolRegistry) {
          if (request.walletAddress === address) {
            this.updateValidationWindow(request);
            resolve(request);
          }
        }
      }
    });
  }

  checkIfAddressIsInMempoolValidRegistry(address) {
    return new Promise((resolve, reject) => {
      for (let request of this.mempoolValidRegistry) {
        console.log(request.status.address, address);
        if (request.status.address === address) {
          resolve();
        }
      }
      reject('There is no request.\n\n Please make first a request at localhost:8000/requestValidation and then sign this message');
    });
  }
  updateValidationWindow(request) {
    const TimeoutRequestsWindowTime = 5 * 60 * 10;
    const timestampOfRequest = request.timestamp;
    let timeElapse = (new Date().getTime().toString().slice(0, -3)) - timestampOfRequest;
    let timeLeft = (TimeoutRequestsWindowTime / 1000) - timeElapse;
    request.validationWindow = timeLeft;
  }
  funcionWhichWillValidateTheMessageAndRemovesItFromTheMempool(address, signature) {
    return new Promise((resolve) => {
      if (this.timeoutRequests.includes(address) === false) {
        resolve('Please first create a request');
      } else {
        this.mempoolRegistry.forEach(request => {
          if (request.walletAddress === address) {
            this.updateValidationWindow(request);
            if (parseInt(request.validationWindow) < 1) {
              console.log(request.message, address, signature);
              try {
                let isValid = bitcoinMessage.verify(request.message, address, signature);
                if (isValid) {
                  let indexOne = this.mempoolRegistry.indexOf(request);
                  let indexTwo = this.timeoutRequests.indexOf(request);
                  this.mempoolRegistry.splice(indexOne, 1);
                  this.timeoutRequests.splice(indexTwo, 1);
                  let mempoolValid = new MempoolValid(request.walletAddress, request.timestamp, request.message, request.validationWindow, true);
                  this.mempoolValidRegistry.push(mempoolValid);
                  console.log(JSON.stringify(mempoolValid) + '\n\nYou are granted access to store a star\n\n');
                  resolve(mempoolValid);
                } else {
                  resolve('Signature does not correspond to the message');
                }
              } catch (err) {
                resolve('the signature is false');
              }
            } else {
              resolve('please wait till the validationWindow is under zero: ' + JSON.stringify(request.validationWindow));
            }
          }
        });
      }
    });
  }

}


export default Mempool;
