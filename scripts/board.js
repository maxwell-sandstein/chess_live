const NullPiece = require('./pieces/null_piece');
const Bishop = require('./pieces/bishop');
const Knight = require('./pieces/knight');
const Rook = require('./pieces/rook');
const Pawn = require('./pieces/pawn');
const King = require('./pieces/king');
const Queen = require('./pieces/queen');
const COLORS = require('./constants/colors');
const MoveResults = require('./constants/move_results');
const HelperMethods = require('./constants/helper_methods');

const Board = function(){
  this.grid = new Array(8);

  for (let rowIdx = 0; rowIdx < 8; rowIdx++){
    this.grid[rowIdx] = new Array(8);
    for (let colIdx = 0; colIdx < 8; colIdx++){
      this.grid[rowIdx][colIdx] = new NullPiece({row: rowIdx, col:colIdx});
    }
  }

  placePawns.call(this, COLORS.BLACK, 1);
  placePawns.call(this, COLORS.WHITE, 6);

  placeMajors.call(this, COLORS.BLACK, 0);
  placeMajors.call(this, COLORS.WHITE, 7);

};

Board.prototype.flattenedGrid = function(){
  return Array.prototype.concat.apply([], this.grid);
}

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
  const movingPiece = this.getPiece(startCoords)
  if (this.isValidMove(movingPiece, endCoords)){
    return this.actual_move(startCoords, endCoords);
  } else{
    return MoveResults.FAILURE;
  }
};

Board.prototype.actual_move = function(startCoords, endCoords){
  const movingPiece = this.getPiece(startCoords)
  movingPiece.hasMoved = true;

  this.movePiece(movingPiece, endCoords);
  if (movingPiece.constructor === Pawn){
    if (endCoords.row === 7 || endCoords.row === 0){
      return endCoords;
    }
  }
  if (this.isInCheckMate(movingPiece.color)){
    return MoveResults.CHECKMATE;
  }

  return MoveResults.SUCCESS;
};

Board.prototype.makePromotion = function(pos, piece){
  let pieceConstructor = this.determinePieceConstructor(piece)
  const pawnToPromote = this.getPiece(pos)
  this.grid[pos.row][pos.col] = new pieceConstructor(pawnToPromote.color, pos, this);
  if (this.isInCheckMate(pawnToPromote.color)){
    return MoveResults.CHECKMATE;
  }
  else{
    return MoveResults.SUCCESS;
  }
}

Board.prototype.determinePieceConstructor = function(piece){
  switch (piece){
    case 'Rook':{
      return Rook;
    }
    case 'Knight':{
      return Knight;
    }
    case 'Bishop':{
      return Bishop;
    }
    case 'Queen':{
      return Queen;
    }
  }
}

Board.prototype.isInCheckMate = function(checkingColor){
  const checkedColor = checkingColor === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK;
  if (!this.isInCheck(checkedColor)){
    return false;
  }

  const moves = this.movesByColor(checkedColor);
  const hasAValidMove = !moves.some((move) =>{
    return !this.wouldBeInCheckAfterMove(move.startCoords, move.endCoords)
  })

  return hasAValidMove;
};

Board.prototype.movePiece = function(movingPiece, endCoords){
  this.grid[movingPiece.pos.row][movingPiece.pos.col] = new NullPiece(movingPiece.pos);
  movingPiece.pos = endCoords;
  this.grid[endCoords.row][endCoords.col] = movingPiece;
}

Board.prototype.isValidMove = function(movingPiece, endCoords){
  if (!movingPiece.moves().some((move) => {
    return HelperMethods.arePositionsEqual(endCoords, move);
  })){
    return false;
  }

  return !this.wouldBeInCheckAfterMove(movingPiece.pos, endCoords);
}

Board.prototype.wouldBeInCheckAfterMove = function(startCoords, endCoords){
  const toPlaceBack = this.getPiece(endCoords);
  const movingPiece = this.getPiece(startCoords);
  this.movePiece(movingPiece, endCoords);

  const inCheckAfterMove = this.isInCheck(movingPiece.color);

  this.movePiece(movingPiece, startCoords);
  this.movePiece(toPlaceBack, endCoords)

  return inCheckAfterMove;
}

Board.prototype.renderPieces = function(squares){
  this.grid.forEach(function(row, rowIdx){
    row.forEach(function(piece, colIdx){
      let squareIdx = 8 * rowIdx + colIdx;
      squares[squareIdx].innerHTML = piece.symbol;
    });
  });
};

Board.prototype.isInRange = function(pos){
  if (pos.row < 0 || pos.row > 7 || pos.col < 0 || pos.col > 7){
    return false;
  }
  else {
    return true;
  }
}

Board.prototype.isInCheck = function(checkedColor){
  const checkingColor = checkedColor === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK;
  const checkingMoves = this.movesByColor(checkingColor);
  const checkedKing = this.findKingByColor(checkedColor);

  return checkingMoves.some((move) => {
    return HelperMethods.arePositionsEqual(move.endCoords, checkedKing.pos);
  })
}

Board.prototype.movesByColor = function(color){
  let squares = this.flattenedGrid()
  const totalMovesByColor = squares.reduce((totalMoves, square) =>{
    if (square.color === color){
      const endCoords = square.moves();
      const moves = endCoords.map(function(endCoord){
        return {startCoords: square.pos, endCoords: endCoord};
      })

      totalMoves = totalMoves.concat(moves)
    }
    return totalMoves;
  }, [])

  return totalMovesByColor;
}

Board.prototype.findKingByColor = function(color){
  let squares = this.flattenedGrid()
  for (let i = 0; i < squares.length; i++){
    if (squares[i].constructor === King && squares[i].color === color){
      return squares[i];
    }
  }
}

module.exports = Board;
