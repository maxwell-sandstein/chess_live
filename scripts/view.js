const Game = require('./game');

const View = function(mainEl){
  this.mainEl = mainEl;
  this.chessBoardDisplay = mainEl.querySelector('.chess-board');
  this.game = new Game();

  setUpBoard.call(this);
};

View.prototype.setUpBoard = function(){
  let html = '';
  for (var i = 0; i < 8; i++){
    for (var j = 0; j < 8; j++){
      let square;
      if((i + j) % 2 === 0){
        square = "<li class='white'></li>";
      }
      else{
        square = "<li class='black'></li>";
      }

      html += square;
    }
  }

  this.chessBoardDisplay.innerHTML = html;

  this.render();
};

View.prototype.render = function(){
  this.render();
};

View.prototype.render = function(){
  this.game.board.renderPieces(this.chessBoardDisplay.children);
};

module.exports = View;
