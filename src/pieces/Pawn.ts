import { Board, CaptureOptions, Move, MoveType } from "@lc/core";
import { BoardVector2d, Direction } from "@lc/geometry";
import { DirectedPiece, PieceOptions, PieceType, Piece } from "@lc/pieces";
import { PieceMovement } from "@lc/piece-movements";
import { ObjectsUtilities } from "utils/ObjectUtilities.js";

export class Pawn extends DirectedPiece {
  private _enPassantPosition?: BoardVector2d;
  private _promotionPosition?: BoardVector2d;

  public constructor(position: BoardVector2d, playerId: number, board: Board) {
    const options: PieceOptions =
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
      && board.lastMove?.piece !== null
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
      let move: Partial<Move> = {
        destination: piece.position.add(direction) as BoardVector2d,
        moveType: MoveType.Move
      } 
      this._allMoves.push(move);
      if (board.canMoveTo(piece.position.add(direction), piece, CaptureOptions.NoCapture)) {
        this._legalMoves.push(ObjectsUtilities.objectDeepcopy(move));
      }
    }

    // Advance 2 squares

    if (!board.isOutOfBounds(piece.position.add(direction.mul(2)))) {
      let move: Partial<Move> = {
        destination: piece.position.add(direction.mul(2)) as BoardVector2d,
        moveType: MoveType.Move
      }
      this._allMoves.push(move);
      if (
        !piece.wasMoved()
        && board.canMoveTo(piece.position.add(direction.mul(2)), piece, CaptureOptions.NoCapture)
        && this.legalMoves.length > 0
      ) {
        this._legalMoves.push(ObjectsUtilities.objectDeepcopy(move));
      }
    }

    // Capture

    for (let increment of captureDeltas) {
      let position: BoardVector2d = piece.position.add(increment);
      let move: Partial<Move> = {
        destination: position,
        moveType: MoveType.Move & MoveType.Capture
      }
      if (!board.isOutOfBounds(position)) {
        this._allMoves.push(move);
        if (!board.canMoveTo(position, piece, CaptureOptions.RequiredCapture)) { // Additional data
          this._legalMoves.push(ObjectsUtilities.objectDeepcopy(move));
          this._capturableMoves.push(ObjectsUtilities.objectDeepcopy(move));
        }
      }

    }

    // En Passant

    if (piece.isOnEnPassantPosition()) {
      for (let position of captureDeltas) {
        let tmpPosition: BoardVector2d = piece.position.add(position);
        let move: Partial<Move> = {
          destination: position,
          moveType: MoveType.Move & MoveType.Capture
        }
        if (this.isEnPassantLegal(tmpPosition)) {
          this._allMoves.push(move);
          this._legalMoves.push(ObjectsUtilities.objectDeepcopy(move));
          this._capturableMoves.push(ObjectsUtilities.objectDeepcopy(move));
        }
      }
    }

    // Promotion flag

    let commonMoves: Partial<Move>[] = [...this._allMoves,...this._legalMoves,...this._capturableMoves];
    for (let move of commonMoves) {
      if ((this.piece as Pawn).promotionPosition.y === move.destination!.y) {
        move.moveType! &= MoveType.Promotion;
      }
    }
  }
}