import { Board, CaptureOptions } from "core/Board.js";
import { BoardVector2d, Direction } from "@lc/geometry";
import { DirectedPiece, PieceOpitons, PieceType, Piece } from "@lc/pieces";
import { PieceMovement } from "@lc/piece-movements";

export class Pawn extends DirectedPiece {
  private _enPassantPosition?: BoardVector2d;
  private _promotionPosition?: BoardVector2d;

  public constructor(position: BoardVector2d, playerId: number, board: Board) {
    const options: PieceOpitons =
    {
      pieceType: PieceType.PAWN,
      movement: new PawnMovement(board)
    }
    super(position, playerId, board, options);
    this.movement.piece = this
  }

  public set direction(direction: Direction) {
    if (direction % 2 === 1) {
      throw new Error("Direction for PawnPiece mustn't be diagonal.");
    }
    super._direction = direction;
  }

  public get direction(): Direction | undefined {
    return this._direction;
  }

  public set enPassantPosition(position: BoardVector2d) {
    this._enPassantPosition = position;
  }

  public set promotionPosition(position: BoardVector2d) {
    this._promotionPosition = position;
  }

  

  public isOnEnPassantPosition(): boolean {
    return this._enPassantPosition === this._position;
  }

  public isOnPromotionPosition(): boolean {
    return this._promotionPosition!.y === this._position.y;
  }
}

export class PawnMovement extends PieceMovement {

  public isEnPassantLegal(destination: BoardVector2d): boolean {
    const piece: Pawn = this._piece as Pawn;
    const board: Board = this.board;
    const otherPiece: Piece | null = board.getPiece(destination.sub(Direction.toBoardVector2d(piece.direction!)));
    return otherPiece !== null
      && !otherPiece.isSameColor(piece)
      && otherPiece.pieceType === PieceType.PAWN
      && board.canMoveTo(destination, piece, CaptureOptions.RequiredCapture)
      && board.getLastMove()?.piece !== null
      && piece.isOnEnPassantPosition();
  }

  protected updateMovesWrapped(): void {
    const piece: Pawn = this._piece as Pawn;
    const board: Board = this.board;
    const direction: BoardVector2d = Direction.toBoardVector2d(piece.direction as Direction);
    const captureDeltas: BoardVector2d[] = [
      Direction.toBoardVector2d(piece.direction!).reverseAxis().add(Direction.toBoardVector2d(piece.direction!)),
      Direction.toBoardVector2d(piece.direction!).reverseAxis().opposite().add(Direction.toBoardVector2d(piece.direction!))
    ]

    this.clearMoves();

    // Advance 1 square

    if (!board.isOutOfBounds(piece.position.add(direction))) {
      this._allMoves.push(piece.position.add(direction));
      if (board.canMoveTo(piece.position.add(direction), piece, CaptureOptions.NoCapture)) {
        this._legalMoves.push(piece.position.add(direction));
      }
    }

    // Advance 2 squares

    if (!board.isOutOfBounds(piece.position.add(direction.mul(2)))) {
      this._allMoves.push(piece.position.add(direction.mul(2)));
      if (
        !piece.wasMoved()
        && board.canMoveTo(piece.position.add(direction.mul(2)), piece, CaptureOptions.NoCapture)
        && this.legalMoves.length > 0
      ) {
        this._legalMoves.push(piece.position.add(direction.mul(2)));
      }
    }

    // Capture

    for (let increment of captureDeltas) {
      let position: BoardVector2d = piece.position.add(increment);
      if (!board.isOutOfBounds(position)) {
        this._allMoves.push(position);
        if (!board.canMoveTo(position, piece, CaptureOptions.RequiredCapture)) { // Additional data
          this._legalMoves.push(position.copy());
          this._capturableMoves.push(position.copy());
        }
      }

    }

    // En Passant

    if (piece.isOnEnPassantPosition()) {
      for (let position of captureDeltas) {
        let tmpPosition: BoardVector2d = piece.position.add(position);
        if (this.isEnPassantLegal(tmpPosition)) {
          this._allMoves.push(tmpPosition);
          this._legalMoves.push(tmpPosition.copy());
          this._capturableMoves.push(tmpPosition.copy());
        }
      }
    }
  }
}