class MempoolValid {
  constructor(walletAddress, requestTimeStamp, message, validationWindow, valid) {
    this.registerStar = true;
    this.status = {
      address: walletAddress,
      requestTimeStamp: requestTimeStamp,
      message: message,
      validationWindow: validationWindow,
      messageSignature: valid
    };
  }
}

export default MempoolValid;
