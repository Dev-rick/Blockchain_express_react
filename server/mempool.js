import Request from './request.js';

class Mempool {
  constructor() {
    this.mempool = []; //saves the whole request
    this.timeoutRequests = []; //exists only for a faster check if request is still in the mempool
  }
  functionWichWillPutRequestInMempool(address) {
    return new Promise((resolve) => {
      if (this.timeoutRequests.includes(address) === false) {
        let request = new Request(address);
        this.timeoutRequests.push(address);
        this.mempool.push(request);
        setTimeout(function(address, request) {
          let indexOne = this.timeoutRequests.indexOf(address);
          let indexTwo = this.mempool.indexOf(request);
          this.timeoutRequests.splice(indexOne, 1);
          this.mempool.splice(indexTwo, 1);
        }, 5 * 60 * 1000);
        resolve(request);
      } else {

        for (let request of this.mempool) {
          if (request.walletAddress === address) {
            const TimeoutRequestsWindowTime = 5 * 60 * 1000;
            const timestampOfRequest = request.timestamp;
            let timeElapse = (new Date().getTime().toString().slice(0, -3)) - timestampOfRequest;
            let timeLeft = (TimeoutRequestsWindowTime / 1000) - timeElapse;
            request.validationWindow = timeLeft;
            resolve(request);
          }
        }
      }
    });
  }
}


export default Mempool;
