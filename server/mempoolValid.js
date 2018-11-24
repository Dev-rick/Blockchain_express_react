class MempoolValid {
  constructor(request) {
    this.registerStar = true;
    this.status = {
      address: request.walletAddress,
      requestTimeStamp: request.requestTimeStamp,
      message: request.message,
      validationWindow: 30 * 60,
      messageSignature: true
    };
  }
}

export default MempoolValid;
