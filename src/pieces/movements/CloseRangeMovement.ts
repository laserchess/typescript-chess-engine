import { Board, CaptureOptions, Move, MoveType } from "@lc/core";
import { BoardVector2d } from "@lc/geometry";
import { Piece } from "@lc/pieces";
import { PieceMovement } from "@lc/piece-movements";

export class CloseRangeMovement extends PieceMovement {
  // This method sets all around moves as capturableMoves.
  public override updateMoves(): void {
    this.preUpdateMoves();

    const piece: Piece = this.piece as Piece;
    const board: Board = this.board;
    this.preUpdateMoves()

    for (const scalar1 of [-1, 1, 0]) {
      for (const scalar2 of [-1, 1, 0]) {
        if (scalar1 === 0 && scalar2 === 0) {
          continue;
        }
        const newVector: BoardVector2d = new BoardVector2d(scalar1, scalar2).add(piece.position);
        let move: Partial<Move> = {
          destination: newVector,
          moveType: MoveType.Move
        }

        if (board.isOutOfBounds(newVector)) {
          continue;
        }
        if (board.canMoveTo(newVector, piece, CaptureOptions.NoCapture)) {
          this.legalMoves.push(move);
        }
        else if (board.canMoveTo(newVector, piece, CaptureOptions.RequiredCapture)) {
          move.moveType! |= MoveType.Capture;
          this.legalMoves.push(move)
        }
        else {
          this.illegalMoves.push(move);
        }
      }
    }
  }
}