const ChessUnicode = require('../constants/pieces_unicode');
const Colors = require('../constants/colors');

const Bishop = function(color, pos, board){
  this.color = color;
  this.pos = pos;
  setUnicode.call(this)
};

function setUnicode(){
  if (this.color === Colors.BLACK){
    this.symbol = ChessUnicode.BLACK_BISHOP;
  }
  else{
    this.symbol = ChessUnicode.WHITE_BISHOP;
  }
}

module.exports = Bishop;
