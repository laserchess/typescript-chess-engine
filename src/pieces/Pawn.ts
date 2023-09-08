import { Board, CaptureOptions, Move, MoveType } from "@lc/core";
import { BoardVector2d, Direction, DirectionUtils } from "@lc/geometry";
import { DirectedPiece, PieceType, Piece } from "@lc/pieces";
import { PieceMovement } from "@lc/piece-movements";

export class Pawn extends DirectedPiece {
  private _enPassantPosition?: BoardVector2d;
  private _promotionPosition?: BoardVector2d;

  protected override initType(): void {
    this._type = PieceType.PAWN;
    this._movement  = new PawnMovement(this, this.board);
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
    return this._enPassantPosition === this.position;
  }

  public isOnPromotionPosition(): boolean {
    return this._promotionPosition!.y === this.position.y;
  }
}

export class PawnMovement extends PieceMovement {

  public isEnPassantLegal(destination: BoardVector2d): boolean {
    const piece: Pawn = this.piece as Pawn;
    const board: Board = this.board;
    const otherPiece: Piece | null = board.getPiece(destination.sub(DirectionUtils.toBoardVector2d(piece.direction!)));
    return otherPiece !== null
      && !otherPiece.isSameColor(piece)
      && otherPiece.type === PieceType.PAWN
      && board.canMoveTo(destination, piece, CaptureOptions.NoCapture)
      && board.lastMove?.piece !== null
      && board.lastMove?.piece !== otherPiece
      && piece.isOnEnPassantPosition();
  }

  protected updateMoves(): void {
    this.preUpdateMoves();

    const piece: Pawn = this.piece as Pawn;
    const board: Board = this.board;
    const direction: BoardVector2d = DirectionUtils.toBoardVector2d(piece.direction as Direction);
    const captureDeltas: BoardVector2d[] = [
      DirectionUtils.toBoardVector2d(piece.direction!).reverseAxis().add(DirectionUtils.toBoardVector2d(piece.direction!)),
      DirectionUtils.toBoardVector2d(piece.direction!).reverseAxis().opposite().add(DirectionUtils.toBoardVector2d(piece.direction!))
    ];

    // Advance 1 square
    if (!board.isOutOfBounds(piece.position.add(direction))) {
      const move: Partial<Move> = {
        destination: piece.position.add(direction) as BoardVector2d,
        moveType: MoveType.Move
      } 
      if (board.canMoveTo(piece.position.add(direction), piece, CaptureOptions.NoCapture)) {
        this.legalMoves.push(move);
      }
      else {
        this.illegalMoves.push(move);
      }
    }

    // Advance 2 squares
    if (!board.isOutOfBounds(piece.position.add(direction.mul(2)))) {
      const move: Partial<Move> = {
        destination: piece.position.add(direction.mul(2)) as BoardVector2d,
        moveType: MoveType.Move
      }
      if (
        !piece.wasMoved()
        && board.canMoveTo(piece.position.add(direction.mul(2)), piece, CaptureOptions.NoCapture)
        && this.legalMoves.length > 0
      ) {
        this.legalMoves.push(move);
      }
      else {
        this.illegalMoves.push(move);
      }
    }

    // Capture
    for (const increment of captureDeltas) {
      const position: BoardVector2d = piece.position.add(increment);
      const move: Partial<Move> = {
        destination: position,
        moveType: MoveType.Move & MoveType.Capture
      }
      if (!board.isOutOfBounds(position)) {
        if (!board.canMoveTo(position, piece, CaptureOptions.RequiredCapture)) { // Additional data
          this.legalMoves.push(move);
        }
        else {
          this.illegalMoves.push(move);
        }
      }
    }

    // En Passant
    if (piece.isOnEnPassantPosition()) {
      for (const position of captureDeltas) {
        const tmpPosition: BoardVector2d = piece.position.add(position);
        const move: Partial<Move> = {
          destination: position,
          moveType: MoveType.Move | MoveType.Capture
        }
        if (this.isEnPassantLegal(tmpPosition)) {
          this.legalMoves.push(move);
        }
        else {
          this.illegalMoves.push(move);
        }
      }
    }

    // Promotion flag
    const commonMoves: Partial<Move>[] = [...this.legalMoves,...this.illegalMoves];
    for (const move of commonMoves) {
      if ((this.piece as Pawn).promotionPosition.y === move.destination!.y) {
        move.moveType! |= MoveType.Promotion;
      }
    }
  }

}