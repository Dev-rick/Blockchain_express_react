class Request {
  constructor(address) {
    this.walletAddress = address;
    this.timestamp = new Date().getTime().toString().slice(0, -3);
    this.message = address + this.timestamp  + ':starRegistry';
    this.validationWindow = 5 * 60;
  }
}

export default Request;
