class Request {
  constructor(address) {
    this.walletAddress = address;
    this.timeStamp = new Date().getTime().toString().slice(0, -3);
    this.message = address + ':' + this.timeStamp  + ':starRegistry';
    this.validationWindow = 5 * 60;
  }
}

export default Request;
