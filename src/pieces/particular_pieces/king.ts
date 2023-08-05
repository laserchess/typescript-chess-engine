import { PieceMoveType } from "core/move_type.js";
import { BoardVector2d } from "geometry";
import { Piece, PieceMovement, PieceOpitons, PieceType } from "pieces";
import { AroundMovement } from "pieces/around_piece.js";


export class KingPiece extends Piece {

  public constructor(position: BoardVector2d, playerId: number, board: Board) {
    const options: PieceOpitons =
    {
      pieceType: PieceType.KING,
      movement: new KingMovement(board)
    }
    super(position, playerId, board, options);
    this.movement.piece = this;
  }
}

export class KingMovement extends AroundMovement {

  public isCastlingLegal(castling: PieceMoveType): boolean {
    let potentialRook: Piece | undefined;
    if (castling === PieceMoveType.KING_SIDE_CASTLING) {
      potentialRook = this.board.getPiece(new BoardVector2d(this.board.width - 1, this.piece.position.y))
    }
    else if (castling === PieceMoveType.QUEEN_SIDE_CASTLING) {
      potentialRook = this.board.getPiece(new BoardVector2d(0, this.piece.position.y))
    }
    if (
      potentialRook !== undefined
      && potentialRook.pieceType === PieceType.ROOK
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
    if (this.isCastlingLegal(PieceMoveType.KING_SIDE_CASTLING)) {
      this._legalMoves.push(this.piece.position.add(new BoardVector2d(2, 0)))
      this._allMoves.push(this.piece.position.add(new BoardVector2d(2, 0)))
    }
    else if (this.isCastlingLegal(PieceMoveType.QUEEN_SIDE_CASTLING)) {
      this._legalMoves.push(this.piece.position.add(new BoardVector2d(-2, 0)))
      this._allMoves.push(this.piece.position.add(new BoardVector2d(-2, 0)))
    }
  }
}



