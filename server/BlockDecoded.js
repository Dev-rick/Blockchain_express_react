class BlockDecoded {
  constructor(blockData) {
    this.hash = blockData.hash,
      this.height = blockData.height,
      this.body = {
        address: blockData.body.address,
        star: {
          ra: blockData.body.star.ra,
          dec: blockData.body.star.dec,
          story: blockData.body.star.story,
          storyDecoded: this.hex2aToASCII(blockData.body.star.story)
        }
      },
      this.time = blockData.time,
      this.previousBlockHash = blockData.previousBlockHash;
  }
  hex2aToASCII(hexx) {
    const hex = hexx.toString(); //force conversion
    let str = '';
    for (let i = 0;
      (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }
}

export default BlockDecoded;
