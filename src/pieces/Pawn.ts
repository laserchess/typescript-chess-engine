import { Board, CaptureOptions, Move, MoveType } from "@lc/core";
import { BoardVector2d, Direction } from "@lc/geometry";
import { DirectedPiece, PieceType, Piece } from "@lc/pieces";
import { PieceMovement } from "@lc/piece-movements";
import { ObjectsUtilities } from "utils/ObjectUtilities.js";

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
    const otherPiece: Piece | null = board.getPiece(destination.sub(Direction.toBoardVector2d(piece.direction!)));
    return otherPiece !== null
      && !otherPiece.isSameColor(piece)
      && otherPiece.type === PieceType.PAWN
      && board.canMoveTo(destination, piece, CaptureOptions.RequiredCapture)
      && board.lastMove?.piece !== null
      && piece.isOnEnPassantPosition();
  }

  protected updateMovesWrapped(): void {
    const piece: Pawn = this.piece as Pawn;
    const board: Board = this.board;
    const direction: BoardVector2d = Direction.toBoardVector2d(piece.direction as Direction);
    const captureDeltas: BoardVector2d[] = [
      Direction.toBoardVector2d(piece.direction!).reverseAxis().add(Direction.toBoardVector2d(piece.direction!)),
      Direction.toBoardVector2d(piece.direction!).reverseAxis().opposite().add(Direction.toBoardVector2d(piece.direction!))
    ]

    this.clearMoves();

    // Advance 1 square

    if (!board.isOutOfBounds(piece.position.add(direction))) {
      const move: Partial<Move> = {
        destination: piece.position.add(direction) as BoardVector2d,
        moveType: MoveType.Move
      } 
      this.allMoves.push(move);
      if (board.canMoveTo(piece.position.add(direction), piece, CaptureOptions.NoCapture)) {
        this.legalMoves.push(ObjectsUtilities.deepCopy(move));
      }
    }

    // Advance 2 squares

    if (!board.isOutOfBounds(piece.position.add(direction.mul(2)))) {
      const move: Partial<Move> = {
        destination: piece.position.add(direction.mul(2)) as BoardVector2d,
        moveType: MoveType.Move
      }
      this.allMoves.push(move);
      if (
        !piece.wasMoved()
        && board.canMoveTo(piece.position.add(direction.mul(2)), piece, CaptureOptions.NoCapture)
        && this.legalMoves.length > 0
      ) {
        this.legalMoves.push(ObjectsUtilities.deepCopy(move));
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
        this.allMoves.push(move);
        if (!board.canMoveTo(position, piece, CaptureOptions.RequiredCapture)) { // Additional data
          this.legalMoves.push(ObjectsUtilities.deepCopy(move));
          this.capturableMoves.push(ObjectsUtilities.deepCopy(move));
        }
      }

    }

    // En Passant

    if (piece.isOnEnPassantPosition()) {
      for (const position of captureDeltas) {
        const tmpPosition: BoardVector2d = piece.position.add(position);
        const move: Partial<Move> = {
          destination: position,
          moveType: MoveType.Move & MoveType.Capture
        }
        if (this.isEnPassantLegal(tmpPosition)) {
          this.allMoves.push(move);
          this.legalMoves.push(ObjectsUtilities.deepCopy(move));
          this.capturableMoves.push(ObjectsUtilities.deepCopy(move));
        }
      }
    }

    // Promotion flag

    const commonMoves: Partial<Move>[] = [...this.allMoves,...this.legalMoves,...this.capturableMoves];
    for (const move of commonMoves) {
      if ((this.piece as Pawn).promotionPosition.y === move.destination!.y) {
        move.moveType! &= MoveType.Promotion;
      }
    }
  }
}