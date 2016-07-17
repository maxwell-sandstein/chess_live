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

  for (let rowIdx = 0; rowIdx < 8; rowIdx++){
    this.grid[rowIdx] = new Array(8);
    for (let colIdx = 0; colIdx < 8; colIdx++){
      this.grid[rowIdx][colIdx] = NullPiece;
    }
  }

  placePawns.call(this, COLORS.BLACK, 1);
  placePawns.call(this, COLORS.WHITE, 6);

  placeMajors.call(this, COLORS.BLACK, 0);
  placeMajors.call(this, COLORS.WHITE, 7);

};

function placePawns(color, rowIdx){
  this.grid[rowIdx].forEach((_, colIdx) => {
    this.grid[rowIdx][colIdx] = new Pawn(color, {row: rowIdx, col: colIdx}, this);
  });
}

function placeMajors(color, rowIdx){
  this.grid[rowIdx][0] = new Rook(color, {row: rowIdx, col: 0}, this);
  this.grid[rowIdx][7] = new Rook(color, {row: rowIdx, col: 7}, this);

  this.grid[rowIdx][1] = new Knight(color, {row: rowIdx, col: 1}, this);
  this.grid[rowIdx][6] = new Knight(color, {row: rowIdx, col: 6}, this);

  this.grid[rowIdx][2] = new Bishop(color, {row: rowIdx, col: 2}, this);
  this.grid[rowIdx][5] = new Bishop(color, {row: rowIdx, col: 5}, this);

  this.grid[rowIdx][3] = new Queen(color, {row: rowIdx, col: 3}, this);
  this.grid[rowIdx][4] = new King(color, {row: rowIdx, col: 4}, this);
}


Board.prototype.getPiece = function(pos){
  return this.grid[pos.row][pos.col];
};

Board.prototype.move = function(startCoords, endCoords){
  this.grid[startCoords.row][startCoords.col].pos = endCoords;

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
