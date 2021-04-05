String.prototype.capitaliseFirst = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.titleCase = function() {
  return this.split(' ').map((str) => { return str.capitaliseFirst() }).join(' ');
}

String.prototype.hexEncode = function() {
  return '0x' + Buffer.from(this).toString('hex')
}

String.prototype.hexDecode = function() {
  return Buffer.from(this.substring(2), 'hex').toString()
}
