const ChessUnicode = require('../constants/pieces_unicode');
const Colors = require('../constants/colors');

const NullPiece = function(){
  this.symbol = '';
};

NullPiece.prototype.moves = function(){
  return [];
};

NullPiece.prototype.color = function(){
  return 'none';
};





module.exports = new NullPiece();
