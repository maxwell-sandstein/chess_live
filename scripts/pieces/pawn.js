const ChessUnicode = require('../constants/pieces_unicode');
const Colors = require('../constants/colors');

const Pawn = function(color, pos){
  this.color = color;
  this.pos = pos;
  setUnicode.call(this);
};


function setUnicode(){
  if (this.color === Colors.BLACK){
    this.symbol = ChessUnicode.BLACK_PAWN;
  }
  else{
    this.symbol = ChessUnicode.WHITE_PAWN;
  }
}


module.exports = Pawn;
