import { Board, CaptureOptions } from "@lc/core";
import { BoardVector2d } from "@lc/geometry";
import { Piece } from "@lc/pieces";
import { PieceMovement } from "@lc/piece-movements";

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
        if (!board.isOutOfBounds(newVector)) {
          this._allMoves.push(newVector);
          if (board.canMoveTo(newVector, piece, CaptureOptions.OptionalCapture)) {
            this._legalMoves.push(newVector.copy());
            if (board.canMoveTo(newVector, piece, CaptureOptions.RequiredCapture)) { // Additional data
              this._capturableMoves.push(newVector.copy());
            }
          }

        }
      }
    }
  }
}