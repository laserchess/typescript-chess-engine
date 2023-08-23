import { Board, CaptureOptions, Move, MoveType } from "@lc/core";
import { BoardVector2d } from "@lc/geometry";
import { Piece } from "@lc/pieces";
import { PieceMovement } from "@lc/piece-movements";
import { ObjectsUtilities } from "utils/ObjectUtilities.js";

export class CloseRangeMovement extends PieceMovement {

  // This method sets all around moves as capturableMoves.
  protected updateMovesWrapped(): void {
    const piece: Piece = this._piece as Piece;
    const board: Board = this.board;

    for (let scalar1 of [-1, 1, 0]) {
      for (let scalar2 of [-1, 1, 0]) {
        if (scalar1 === 0 && scalar2 === 0) {
          continue;
        }
        let newVector: BoardVector2d = new BoardVector2d(scalar1, scalar2).add(piece.position);
        let move: Partial<Move> = {
          destination: newVector,
        }
        if (!board.isOutOfBounds(newVector)) {
          move = ObjectsUtilities.objectDeepcopy(move);
          move.moveType = MoveType.Move
          this._allMoves.push(move);
          if (board.canMoveTo(newVector, piece, CaptureOptions.OptionalCapture)) {
            move = ObjectsUtilities.objectDeepcopy(move);
            this._legalMoves.push(move);
            if (board.canMoveTo(newVector, piece, CaptureOptions.RequiredCapture)) {
              move.moveType! &= MoveType.Capture;
              move = ObjectsUtilities.objectDeepcopy(move);
              this._capturableMoves.push(move);
            }
          }

        }
      }
    }
  }
}