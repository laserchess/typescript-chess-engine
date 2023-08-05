import { BoardVector2d } from "geometry";
import { Piece, PieceMovement } from "pieces";

export class AroundMovement extends PieceMovement {

  // This method sets all around moves as capturableMoves.
  public updateMoves(): void {
    const piece: Piece = this._piece as Piece;
    const board: Board = this.board;

    this.clearMoves();

    for (let scalar1 of [-1, 1, 0]) {
      for (let scalar2 of [-1, 1, 0]) {
        if (scalar1 === 0 && scalar2 === 0) {
          continue;
        }
        let newVector: BoardVector2d = new BoardVector2d(scalar1, scalar2).add(piece.position);
        if (!board.isOutOfBounds(newVector)) {
          this._allMoves.push(newVector);
          if (board.canMoveTo(newVector, piece)) {
            this._legalMoves.push(newVector.copy());
          }
          if (board.canMoveTo(newVector, piece)) { // Additional data
            this._capturableMoves.push(newVector.copy());
          }
        }
      }
    }
  }
}