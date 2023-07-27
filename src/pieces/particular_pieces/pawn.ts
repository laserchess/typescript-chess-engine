import { BoardVector2d } from "geometry";
import { DirectedPiece, PieceOpitons, PieceMovement, PieceType, Direction, Piece } from "pieces"

export class PawnPiece extends DirectedPiece {
  private _enPassantPosition?: BoardVector2d;
  private _promotionPosition?: BoardVector2d;

  public constructor(position: BoardVector2d, playerId: number, board: Board){
    let options: PieceOpitons =
    {
      pieceType: PieceType.PAWN,
      movement: new PawnMovement(board)
    } 
    super(position, playerId, board, options);
    this.movement.piece = this
  }

  public set enPassantPosition(position: BoardVector2d) {
    if (this._enPassantPosition === undefined) {
      this._enPassantPosition = position;
    }
  }

  public set promotionPosition(position: BoardVector2d) {
    if (this._promotionPosition === undefined) {
      this._promotionPosition = position;
    }
  }

  public isOnEnPassantPosition(): boolean {
    return this._enPassantPosition === this.position;
  }

  public isOnPromotionPosition(): boolean {
    if (this._promotionPosition === undefined){
      throw new Error("promotionPosition of pawn is undefined");
    }
    return this._promotionPosition.y === this._position.y;
  }
}

export class PawnMovement extends PieceMovement {

  public is_en_passant_legal(destination: BoardVector2d): boolean {
    let piece: PawnPiece  = this._piece as PawnPiece;
    let board: Board = this.board;
    if (typeof piece.direction === "undefined") {
      throw new Error("direction of PawnPiece cannot be undefined");
    }
    let otherPiece: Piece = board.getPiece(destination.sub(Direction.toBoardVector2d(piece.direction)));
    return otherPiece !== undefined 
    && otherPiece.isSameColor(piece)
    && otherPiece.pieceType === PieceType.PAWN
    && board.canMoveTo(destination)
    && board.getLastMove().piece === otherPiece
    && piece.isOnEnPassantPosition();
  }


}