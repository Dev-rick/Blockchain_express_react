class MempoolValid {
  constructor(request) {
    this.registerStar = true;
    this.status = {
      address: request.walletAddress,
      requestTimeStamp: request.requestTimeStamp,
      message: request.message,
      validationWindow: request.ValidationWindow,
      messageSignature: true
    };
  }
}

export default MempoolValid;
