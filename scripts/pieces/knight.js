const ChessUnicode = require('../constants/pieces_unicode');
const Colors = require('../constants/colors');

const Knight = function(color, pos){
  this.color = color;
  this.pos = pos;
  setUnicode.call(this)
};


function setUnicode(){
  if (this.color === Colors.BLACK){
    this.symbol = ChessUnicode.BLACK_KNIGHT;
  }
  else{
    this.symbol = ChessUnicode.WHITE_KNIGHT;
  }
}


module.exports = Knight;
