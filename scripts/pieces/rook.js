const ChessUnicode = require('../constants/pieces_unicode');
const Colors = require('../constants/colors');

const Rook = function(color, pos){
  this.color = color;
  this.pos = pos;
  setUnicode.call(this);
};


function setUnicode(){
  if (this.color === Colors.BLACK){
    this.symbol = ChessUnicode.BLACK_ROOK;
  }
  else{
    this.symbol = ChessUnicode.WHITE_ROOK;
  }
}


module.exports = Rook;
