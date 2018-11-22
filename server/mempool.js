import Request from './request.js';

class Mempool {
  constructor() {
    this.mempoolRegistry = []; //saves the whole request
    this.timeoutRequests = []; //exists only for a faster check if request is still in the mempool
    this.requestsThatCanBeVerified = []; //if not in here the time to validate (validationWindow) has not yet expired
  }
  functionWichWillPutRequestInMempool(address) {
    return new Promise((resolve) => {
      if (this.timeoutRequests.includes(address) === false) {
        let request = new Request(address);
        this.timeoutRequests.push(address);
        this.mempoolRegistry.push(request);
        const that = this;
        setTimeout(function() {
          let indexOne = that.timeoutRequests.indexOf(address);
          let indexTwo = that.mempoolRegistry.indexOf(request);
          that.timeoutRequests.splice(indexOne, 1);
          that.requestsThatCanBeVerified.push(that.mempoolRegistry[indexTwo]);
        }, 5 * 60 * 10, that, address, request);
        resolve(request);
      } else {
        for (let request of this.mempoolRegistry) {
          if (request.walletAddress === address) {
            this.updateValidationWindow(request).then(() => {
              resolve(request);
            });
          }
        }
      }
    });
  }
  updateValidationWindow(request) {
    return new Promise((resolve) => {
      const TimeoutRequestsWindowTime = 5 * 60 * 10;
      const timestampOfRequest = request.timestamp;
      let timeElapse = (new Date().getTime().toString().slice(0, -3)) - timestampOfRequest;
      let timeLeft = (TimeoutRequestsWindowTime / 1000) - timeElapse;
      request.validationWindow = timeLeft;
      resolve(request);
    });
  }
  funcionWhichWillValidateTheMessageAndRemovesItFromTheMempool(address, signature) {
    return new Promise((resolve) => {
      for (let request of this.mempoolRegistry) {
        if (address === request.walletAddress) {
          this.updateValidationWindow(request).then((request) => {
            if (parseInt(request.validationWindow) < 1) {
              let index = this.mempoolRegistry.indexOf(request);
              let validatingRequest = this.mempoolRegistry.splice(index, 1);
              console.log(JSON.stringify(validatingRequest) + '\n\nwas validated and entered the blockchain\n\n');
              resolve(JSON.stringify(validatingRequest) + '\n\nwas validated and entered the blockchain\n\n');
            } else {
              console.log('\n\nPlease wait till the validateWindow is zero\n\n' + JSON.stringify(request));
              resolve('\n\nPlease wait till the validateWindow is zero\n\n' + JSON.stringify(request));
            }
          });
        }
      }
      console.log('There is no request');
      resolve('There is no request');
    });
  }

}


export default Mempool;
