class Projection {
  constructor(object) {
    this.basis = object;
    this._alias = {project: {}, skipedKeys: new Set()};
  }

  project(condition) {
    const oldNewKeys = condition.split('->');
    if (oldNewKeys.length !== 2) return new Error(`Projection '${condition}' is not valid`);
    const oldKey = oldNewKeys[0].trim();
    const newKey = oldNewKeys[1].trim();
    const keyIndex = Object.keys(this.basis).indexOf(oldKey);
    if (keyIndex === -1) return new Error(`The old key '${oldKey}' is not exist`);
    this._alias.project[oldKey] = newKey;
    return this;
  }
  
  _createProjection() {
    const projection = {};
    
    Object.keys(this.basis).forEach( (oldKey) => {
      const skip = this._alias.skipedKeys.has(oldKey);
      if (skip) return;
      const value = this.basis[oldKey];
      const newKey = this._alias.project[oldKey];
      if (newKey) {
        projection[newKey] = value;
      } else {
        projection[oldKey] = value;
      }
    })
    return projection;
  }

  reset() {
    this.projection = {};
  }

  without(key) {
    this._alias.skipedKeys.add(key.trim());
    return this
  }

  get value() {
    return this._createProjection();
  }
  }

  module.exports = Projection 