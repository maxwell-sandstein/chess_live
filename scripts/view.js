const Colors = require('./constants/colors');
const Board = require('./board');
const MoveResults = require('./constants/move_results');

const View = function(mainEl){
  this.mainEl = mainEl;
  creatWinMessage.call(this)
  this.chessBoardDisplay = mainEl.querySelector('.chess-board');
  this.board = new Board();
  setUpBoard.call(this);
  this.toMove = Colors.WHITE;
  this.startPos = null;
  this.squareClickDisabled = false;
};

function creatWinMessage(){
  this.winMessage = document.createElement('div');
  this.winMessage.className = 'win-message';

  let winMessageContainer = document.createElement('div');
  winMessageContainer.className = 'win-message-container';
  this.winMessage.appendChild(winMessageContainer);

  winMessageContainer.innerHTML = "<span class='close-message-button'>x</span><span class='message-content'></span>";
  let closeButton = winMessageContainer.firstChild
  this.winMessageContent = winMessageContainer.lastChild
  closeButton.addEventListener('click', () => {
    this.winMessage.style.display = 'none';
  })

  this.mainEl.appendChild(this.winMessage);
}

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
  if (this.squareClickDisabled === true){
    return;
  }

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
      // if(moveResult !== MoveResults.FAILURE && moveResult !== MoveResults.CHECKMATE
      // && moveResult !== MoveResults.SUCCESS){ //pawn promotions position was returned
      //   this.render()
      //
      // }
      if (moveResult === MoveResults.SUCCESS){
        this.renderMoveResult();
      }
      if (moveResult === MoveResults.CHECKMATE){
        this.renderMoveResult()
        this.renderWon();
      }
      return moveResult;
    }
  }
};

View.prototype.renderMoveResult = function(){
  this.unselectPiece();
  this.render();
  this.changeToMove();
}

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

  return move_results;
}

View.prototype.changeToMove = function(){
  this.toMove = this.toMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
}

View.prototype.renderWon = function(){
  let winner = this.toMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
  let message = `${winner} WINS!`
  this.winMessageContent.innerHTML = message;
  this.winMessage.style.display = 'block';
}


module.exports = View;
