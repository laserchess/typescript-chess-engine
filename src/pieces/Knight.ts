import { Board, CaptureOptions, Move, MoveType } from "@lc/core";
import { BoardVector2d, Symmetry } from "@lc/geometry";
import { Piece, PieceOptions, PieceType } from "@lc/pieces";
import { PieceMovement } from "@lc/piece-movements";
import { ObjectsUtilities } from "utils/ObjectUtilities.js";

export class Knight extends Piece {
  public constructor(position: BoardVector2d, playerId: number, board: Board) {
    const options: PieceOptions =
    {
      pieceType: PieceType.KNIGHT,
      movement: new KnightMovement(board)
    };
    super(position, playerId, board, options);
    this.movement.piece = this;
  }

  public rangedCapture(destination: BoardVector2d) {
    this._position = destination;
    this.moveCounter += 1;
    this.board.notifyRangedCapture(this.position, destination);
  }
}

export class KnightMovement extends PieceMovement {


  protected updateMovesWrapped(): void {
    const piece: Knight = this._piece as Knight;
    const board: Board = this.board;
    const baseVectors: BoardVector2d[] = [new BoardVector2d(1, 2), new BoardVector2d(2, 1)];
    const symmetries: Symmetry[] = [Symmetry.None, Symmetry.XAxis, Symmetry.Origin, Symmetry.YAxis];
    const positions: BoardVector2d[] = []

    for (let symmetry of symmetries) {
      for (let vector of baseVectors) {
        positions.push(piece.position.add(vector.applySymmetry(symmetry)));
      }
    }

    for (let position of positions) {
      let move: Partial<Move> = {
        destination: position,
        moveType: MoveType.Move
      }
      if (!board.isOutOfBounds(position)) {
        this._allMoves.push(move);
        if (board.canMoveTo(position, piece, CaptureOptions.OptionalCapture)) {
          move = ObjectsUtilities.objectDeepcopy(move);
          this._legalMoves.push(move);
          if (board.canMoveTo(position, piece, CaptureOptions.RequiredCapture)) {
            move = ObjectsUtilities.objectDeepcopy(move);
            move.moveType! &= MoveType.Capture
            this._capturableMoves.push(move);

            move = {
              destination: position,
              moveType: MoveType.RangedCapture
            }
            this._capturableMoves.push(move);
          }
        }
      }
    }
  }
}