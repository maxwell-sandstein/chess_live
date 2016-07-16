const NullPiece = require('./pieces/null_piece');
const Bishop = require('./pieces/bishop');
const Knight = require('./pieces/knight');
const Rook = require('./pieces/rook');
const Pawn = require('./pieces/pawn');
const King = require('./pieces/king');
const Queen = require('./pieces/queen');
const COLORS = require('./constants/colors');

const Board = function(){
  this.grid = new Array(8);
  Array.forEach(function(_, i){
    this.grid[i] = new Array(8);
  });

  placeEmptySquares.call(this);

  placePawns.call(this, COLORS.BLACK, 1);
  placePawns.call(this, COLORS.WHITE, 6);

  placeMajors.call(this, COLORS.BLACK, 0);
  placeMajors.call(this, COLORS.WHITE, 7);

};

function placeEmptySquares(){
  for (let rowIdx = 2; i < this.grid.length - 2; rowIdx++){
    this.grid[rowIdx].forEach((_, colIdx) => {
      this.grid[rowIdx][colIdx] = NullPiece;
    });
  }
}

function placePawns(color, rowIdx){
  this.grid[rowIdx].forEach((_, colIdx) => {
    this.grid[rowIdx][colIdx] = Pawn.new(color, {row: rowIdx, col: colIdx}, this);
  });
}

function placeMajors(color, rowIdx){
  this.grid[rowIdx][0] = Rook.new(color, {row: rowIdx, col: 0}, this);
  this.grid[rowIdx][7] = Rook.new(color, {row: rowIdx, col: 7}, this);

  this.grid[rowIdx][1] = Knight.new(color, {row: rowIdx, col: 1}, this);
  this.grid[rowIdx][6] = Knight.new(color, {row: rowIdx, col: 6}, this);

  this.grid[rowIdx][2] = Bishop.new(color, {row: rowIdx, col: 2}, this);
  this.grid[rowIdx][5] = Bishop.new(color, {row: rowIdx, col: 5}, this);

  this.grid[rowIdx][3] = Queen.new(color, {row: rowIdx, col: 3}, this);
  this.grid[rowIdx][4] = King.new(color, {row: rowIdx, col: 4}, this);
}


Board.prototype.move = function(startCoords, endCoords){
  this.grid[endCoords.row][endCoords.col] = this.grid[startCoords.row][startCoords.col];
  this.grid[startCoords.row][startCoords.col] = NullPiece;
};

Board.prototype.renderPieces = function(squares){
  this.grid.forEach(function(row, rowIdx){
    row.forEach(function(piece, colIdx){
      let squareIdx = 8 * rowIdx + colIdx;
      squares[squareIdx].innerHTML = piece.symbol;
    });
  });
};

module.exports = Board;
