/**
 * An in-memory store example.
 */
class Store {
  constructor() {
    this.bins = {};
  }
  
  create(ncco) {
    var bin = {
      id: Object.keys(this.bins).length,
      ncco: ncco
    };
    this.bins[bin.id] = bin;
    
    return bin;
  }
  
  read(id) {
    return this.bins[id];
  }
  
  update(id, ncco) {
    var bin = this.bins[id];
    bin.ncco = ncco;
    this.bins[id] = bin;
    return bin;
  }
  
}

module.exports = Store;