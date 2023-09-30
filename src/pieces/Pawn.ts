import { Board, CaptureOptions, Move, MoveType } from "@lc/core";
import { BoardVector2d, Direction, DirectionUtils } from "@lc/geometry";
import { DirectedPiece, PieceType, Piece } from "@lc/pieces";
import { PieceMovement } from "@lc/pieces";

export class Pawn extends DirectedPiece {
  private _enPassantPosition?: BoardVector2d;
  private _promotionPosition?: BoardVector2d;

  protected override initType(): void {
    this._type = PieceType.PAWN;
    this._movement = new PawnMovement(this, this.board);
  }

  public get direction(): Direction {
    return super.direction;
  }

  public set direction(direction: Direction) {
    if (direction % 2 === 1) {
      throw new Error("Direction for PawnPiece mustn't be diagonal.");
    }
    this._direction = direction;
  }

  public set enPassantPosition(position: BoardVector2d) {
    this._enPassantPosition = position;
  }

  public set promotionPosition(position: BoardVector2d) {
    this._promotionPosition = position;
  }

  public get enPassantPosition(): BoardVector2d {
    if (this._enPassantPosition === undefined) {
      throw new Error("enPassantPosition is not initialised.");
    }
    return this._enPassantPosition!;
  }

  public get promotionPosition(): BoardVector2d {
    if (this._promotionPosition === undefined) {
      throw new Error("promotionPosition is not initialised.");
    }
    return this._promotionPosition!;
  }

  public isOnEnPassantPosition(): boolean {
    if (this._enPassantPosition === undefined) {
      throw new Error("enPassantPosition is not initialised.");
    }
    return this._enPassantPosition!.y === this.position.y;
  }

  public isOnPromotionPosition(): boolean {
    if (this._promotionPosition === undefined) {
      throw new Error("promotionPosition is not initialised.");
    }
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

  public override updateMoves(): void {
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
      this.appendToMovePredictionType(board.canMoveTo(piece.position.add(direction), piece, CaptureOptions.NoCapture), move)
    }

    // Advance 2 squares
    if (!board.isOutOfBounds(piece.position.add(direction.mul(2)))) {
      const move: Partial<Move> = {
        destination: piece.position.add(direction.mul(2)) as BoardVector2d,
        moveType: MoveType.Move
      }
      this.appendToMovePredictionType(        
        !piece.wasMoved()
        && board.canMoveTo(piece.position.add(direction.mul(2)), piece, CaptureOptions.NoCapture)
        && this.legalMoves.length > 0
        ,move)
    }

    // Capture
    for (const increment of captureDeltas) {
      const position: BoardVector2d = piece.position.add(increment);
      const move: Partial<Move> = {
        destination: position,
        moveType: MoveType.Move | MoveType.Capture
      }
      if (!board.isOutOfBounds(position)) {
        this.appendToMovePredictionType(board.canMoveTo(position, piece, CaptureOptions.RequiredCapture), move);
      }
      
    }

    // En Passant
    
    for (const increment of captureDeltas) {
      const position: BoardVector2d = piece.position.add(increment);
      const move: Partial<Move> = {
        destination: position,
        moveType: MoveType.Move | MoveType.Capture | MoveType.EnPassant
      }
      if (!board.isOutOfBounds(position)) {
        this.appendToMovePredictionType(this.isEnPassantLegal(position), move);
      }
    }
    

    // Promotion flag
    const commonMoves: Partial<Move>[] = [...this.legalMoves, ...this.illegalMoves];
    for (const move of commonMoves) {
      if ((this.piece as Pawn).promotionPosition.y === move.destination!.y) {
        move.moveType! |= MoveType.Promotion;
      }
    }
  }

}