import { PieceMoveType } from "core/move_type.js";
import { BoardVector2d } from "geometry";
import { Piece, PieceMovement, PieceOpitons, PieceType } from "pieces";
import { AroundMovement } from "pieces/around_piece.js";
import { KnightPiece } from "pieces/particular_pieces/knight.js";


export class KingPiece extends Piece {
  private _kingRook?: Piece;
  private _queenRook?: Piece;

  public constructor(position: BoardVector2d, playerId: number, board: Board) {
    const options: PieceOpitons =
    {
      pieceType: PieceType.KING,
      movement: new KingMovement(board)
    }
    super(position, playerId, board, options);
    this.movement.piece = this;
  }

  public set kingRook(rook: Piece) {
    this._kingRook = this.kingRook;
  }

  public set queenRook(rook: Piece) {
    this._queenRook = this.kingRook;
  }

  public get kingRook(): Piece {
    return this._kingRook!;
  }

  public get queenRook(): Piece {
    return this._queenRook!;
  }
  
}

export class KingMovement extends AroundMovement {

  public isCastlingLegal(castling: PieceMoveType): boolean {
    let potentialRook: Piece;
    let piece: KingPiece = this.piece as KingPiece;
    if (castling === PieceMoveType.KingSideCastling) {
      potentialRook = piece.kingRook;
    }
    else if (castling === PieceMoveType.QueebSideCastling) {
      potentialRook = piece.queenRook;
    }
    else {
      return false;
    }
    
    if (
      potentialRook.pieceType === PieceType.ROOK
      && !potentialRook.wasMoved()
      && !this.piece.wasMoved()
    ) {
      const fromKingUnitVector: BoardVector2d = this.piece.position.sub(potentialRook.position).createUnitVector();
      let currentPosition: BoardVector2d = this.piece.position;

      for (let i = 0; i < 2; i++) {
        if (this.board.isCheckAt(currentPosition, this.piece.playerId)) {
          return false;
        }
        currentPosition = currentPosition.add(fromKingUnitVector);
      }

      currentPosition = this.piece.position;
      while (currentPosition !== potentialRook.position) {
        if (!this.board.canMoveTo(currentPosition, this.piece)) {
          return false;
        }
        currentPosition = currentPosition.add(fromKingUnitVector);
      }
      return true
    }
    return false;
  }

  public updateMoves(): void {
    super.updateMoves();
    if (this.isCastlingLegal(PieceMoveType.KingSideCastling)) {
      this._legalMoves.push(this.piece.position.add(new BoardVector2d(2, 0)))
      this._allMoves.push(this.piece.position.add(new BoardVector2d(2, 0)))
    }
    else if (this.isCastlingLegal(PieceMoveType.QueebSideCastling)) {
      this._legalMoves.push(this.piece.position.add(new BoardVector2d(-2, 0)))
      this._allMoves.push(this.piece.position.add(new BoardVector2d(-2, 0)))
    }
  }
}



