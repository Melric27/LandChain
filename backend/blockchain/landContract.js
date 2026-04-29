const { Blockchain } = require('./blockchain');

class LandContract {
  constructor() {
    this.blockchain = new Blockchain();
    this.worldState = new Map(); // landId → current land record
    this.suspiciousTransactions = []; // List of flagged transactions
  }

  /**
   * Register a new land parcel on the ledger.
   */
  createLand(landId, owner, location, area, price, latitude = null, longitude = null) {
    if (this.worldState.has(landId)) {
      throw new Error(`Land "${landId}" already exists. Duplicate registration is not allowed.`);
    }

    const record = {
      landId,
      owner,
      location,
      area,
      price,
      latitude,
      longitude,
      createdAt: new Date().toISOString(),
    };

    this.worldState.set(landId, { ...record });

    const block = this.blockchain.addBlock({
      type: 'CREATE_LAND',
      landId,
      owner,
      location,
      area,
      price,
      latitude,
      longitude,
    });

    return { record, block };
  }

  /**
   * Transfer ownership of an existing land parcel.
   */
  transferLand(landId, newOwner) {
    if (!this.worldState.has(landId)) {
      throw new Error(`Land "${landId}" not found. Cannot transfer non-existent land.`);
    }

    const land = this.worldState.get(landId);
    const previousOwner = land.owner;

    if (previousOwner === newOwner) {
      throw new Error(`Land "${landId}" is already owned by "${newOwner}".`);
    }

    land.owner = newOwner;
    land.lastTransferredAt = new Date().toISOString();
    this.worldState.set(landId, { ...land });

    const block = this.blockchain.addBlock({
      type: 'TRANSFER_LAND',
      landId,
      previousOwner,
      newOwner,
    });

    return { record: land, block };
  }

  /**
   * Get the current state of a land parcel.
   */
  getLand(landId) {
    if (!this.worldState.has(landId)) {
      throw new Error(`Land "${landId}" not found.`);
    }
    return this.worldState.get(landId);
  }

  /**
   * Retrieve the full history of a land parcel from the blockchain.
   */
  getHistory(landId) {
    const history = this.blockchain
      .getChain()
      .filter((block) => block.data && block.data.landId === landId)
      .map((block) => ({
        blockIndex: block.index,
        timestamp: block.timestamp,
        type: block.data.type,
        details: block.data,
        hash: block.hash,
      }));

    if (history.length === 0) {
      throw new Error(`No history found for land "${landId}".`);
    }

    return history;
  }

  /**
   * List all registered lands.
   */
  getAllLands() {
    return Array.from(this.worldState.values());
  }

  /**
   * Add a suspicious transaction to the system.
   */
  addSuspiciousTransaction(transaction) {
    this.suspiciousTransactions.push({
      ...transaction,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Retrieve all suspicious transactions.
   */
  getSuspiciousTransactions() {
    return this.suspiciousTransactions;
  }

  /**
   * Passthrough helpers for the underlying blockchain.
   */
  getChain() {
    return this.blockchain.getChain();
  }

  validateChain() {
    return this.blockchain.isChainValid();
  }

  getChainLength() {
    return this.blockchain.getLength();
  }
}

module.exports = { LandContract };
