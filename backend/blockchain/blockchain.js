const crypto = require('crypto');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.index +
          this.previousHash +
          this.timestamp +
          JSON.stringify(this.data)
      )
      .digest('hex');
  }
}

class Blockchain {
  constructor() {
    this.chain = [this._createGenesisBlock()];
  }

  _createGenesisBlock() {
    return new Block(0, new Date().toISOString(), { message: 'Genesis Block — LandChain Initialized' }, '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data) {
    const previousBlock = this.getLatestBlock();
    const newBlock = new Block(
      previousBlock.index + 1,
      new Date().toISOString(),
      data,
      previousBlock.hash
    );
    this.chain.push(newBlock);
    return newBlock;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      // Recalculate and verify current block hash
      const recalculated = crypto
        .createHash('sha256')
        .update(
          current.index +
            current.previousHash +
            current.timestamp +
            JSON.stringify(current.data)
        )
        .digest('hex');

      if (current.hash !== recalculated) {
        return { valid: false, error: `Block ${current.index} has been tampered with` };
      }

      // Verify link to previous block
      if (current.previousHash !== previous.hash) {
        return { valid: false, error: `Block ${current.index} has a broken chain link` };
      }
    }
    return { valid: true, message: 'Blockchain is valid ✅' };
  }

  getChain() {
    return this.chain;
  }

  getLength() {
    return this.chain.length;
  }
}

module.exports = { Block, Blockchain };
