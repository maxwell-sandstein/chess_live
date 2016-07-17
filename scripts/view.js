const Colors = require('./constants/colors');
const Board = require('./board');
const MoveResults = require('./constants/move_results');

const View = function(mainEl){
  this.mainEl = mainEl;
  this.chessBoardDisplay = mainEl.querySelector('.chess-board');
  this.board = new Board();
  setUpBoard.call(this);
  this.toMove = Colors.WHITE;
  this.startPos = null;
};

function setUpBoard(){
  let html = '';
  for (var i = 0; i < 8; i++){
    for (var j = 0; j < 8; j++){
      let square = document.createElement('li');
      square.addEventListener('click', this.squareClick.bind(this, {row: i, col: j}));

      if((i + j) % 2 === 0){
        square.className = 'white';
      }
      else{
        square.className ='black';
      }

      square.innerHTML = '<span></span>'
      this.chessBoardDisplay.appendChild(square);
    }
  }

  this.render();
};

View.prototype.render = function(){
  this.board.renderPieces(this.chessBoardDisplay.querySelectorAll('span'));
};

View.prototype.squareClick = function(pos){
  if (this.startPos === null){
    return this.selectPiece(pos);
  }
  else{
    if (pos === this.startPos){
      this.unselectPiece();
      this.render();
    }
    else{
      let moveResult = this.move(pos);
      if (moveResult === MoveResults.SUCCESS){
        this.unselectPiece();
        this.render();
      }
      else{
        return moveResult;
      }
    }
  }
};

View.prototype.selectPiece = function(pos){
  let piece = this.board.getPiece(pos)
  if (piece.color !== this.toMove){
    return 'invalid selection'
  }
  else{
    this.startPos = pos;
    this.addSelectedClass(pos);
    this.render()
  }
}

View.prototype.unselectPiece = function(){
  this.removeSelectedClass()
  this.startPos = null;
}

View.prototype.addSelectedClass = function(pos){
  const squareIdx = (pos.row * 8) + pos.col;
  const square = this.chessBoardDisplay.children[squareIdx]

  square.className += ' selected'
}

View.prototype.removeSelectedClass = function(){
  const squareIdx = (this.startPos.row * 8) + this.startPos.col;
  const square = this.chessBoardDisplay.children[squareIdx]

  const selectedMatch = new RegExp('(^|\\s)' + 'selected' + '(\\s|$)');
  square.className = square.className.replace(selectedMatch, ' ');
}

View.prototype.move = function(endPos){ //return successful move
  const move_results = this.board.move(this.startPos, endPos);
  if (move_results === MoveResults.SUCCESS){
    this.changeToMove()
  }
  
  return move_results;
}

View.prototype.changeToMove = function(){
  this.toMove = this.toMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
}


module.exports = View;
