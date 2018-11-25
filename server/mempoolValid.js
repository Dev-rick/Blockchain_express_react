class MempoolValid {
  constructor(request) {
    this.registerStar = true;
    this.status = {
      address: request.walletAddress,
      requestTimeStamp: request.timeStamp,
      message: request.message,
      validationWindow: request.validationWindow,
      messageSignature: true
    };
  }
}

export default MempoolValid;
