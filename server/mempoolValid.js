class MempoolValid {
  constructor(walletAddress, requestTimeStamp, message, validationWindow, valid) {
    this.registerStar = true;
    this.status = {
      address: walletAddress,
      requestTimeStamp: requestTimeStamp,
      message: message,
      validationWindow: 30 * 60 * 1000,
      messageSignature: valid
    };
  }
}

export default MempoolValid;
