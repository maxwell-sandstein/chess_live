const ChessUnicode = require('../constants/pieces_unicode');
const Colors = require('../constants/colors');

const NullPiece = function(){
  this.symbol = '';
  this.color = 'none';
};

NullPiece.prototype.moves = function(){
  return [];
};







module.exports = new NullPiece();
