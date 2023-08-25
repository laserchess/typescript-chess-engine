import { Board, CaptureOptions, Move, MoveType } from "@lc/core";
import { BoardVector2d } from "@lc/geometry";
import { Piece } from "@lc/pieces";
import { PieceMovement } from "@lc/piece-movements";
import { ObjectUtilities } from "@lc/utils";

export class CloseRangeMovement extends PieceMovement {

  // This method sets all around moves as capturableMoves.
  protected updateMovesWrapped(): void {
    const piece: Piece = this.piece as Piece;
    const board: Board = this.board;

    for (const scalar1 of [-1, 1, 0]) {
      for (const scalar2 of [-1, 1, 0]) {
        if (scalar1 === 0 && scalar2 === 0) {
          continue;
        }
        const newVector: BoardVector2d = new BoardVector2d(scalar1, scalar2).add(piece.position);
        let move: Partial<Move> = {
          destination: newVector,
        }
        if (!board.isOutOfBounds(newVector)) {
          move = ObjectUtilities.deepCopy(move);
          move.moveType = MoveType.Move
          this.allMoves.push(move);
          if (board.canMoveTo(newVector, piece, CaptureOptions.OptionalCapture)) {
            move = ObjectUtilities.deepCopy(move);
            this.legalMoves.push(move);
            if (board.canMoveTo(newVector, piece, CaptureOptions.RequiredCapture)) {
              move.moveType! &= MoveType.Capture;
              move = ObjectUtilities.deepCopy(move);
              this.capturableMoves.push(move);
            }
          }

        }
      }
    }
  }
}