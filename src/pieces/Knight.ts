import { Board, CaptureOptions, Move, MoveType } from "@lc/core";
import { BoardVector2d, Symmetry } from "@lc/geometry";
import { Piece, PieceType } from "@lc/pieces";
import { PieceMovement } from "@lc/piece-movements";
import { ObjectUtilities } from "@lc/utils";

export class Knight extends Piece {
  protected override initType(): void {
    this._type = PieceType.KNIGHT;
    this._movement  = new KnightMovement(this, this.board);
  }

  public rangedCapture(destination: BoardVector2d) {
    this.position = destination;
    this.moveCounter += 1;
    // this.board.notifyRangedCapture(this.position, destination);
  }
}

export class KnightMovement extends PieceMovement {

  protected updateMoves(): void {
    this.preUpdateMoves();

    const piece: Knight = this.piece as Knight;
    const board: Board = this.board;
    const baseVectors: BoardVector2d[] = [new BoardVector2d(1, 2), new BoardVector2d(2, 1)];
    const symmetries: Symmetry[] = [Symmetry.None, Symmetry.XAxis, Symmetry.Origin, Symmetry.YAxis];
    const positions: BoardVector2d[] = []

    for (const symmetry of symmetries) {
      for (const vector of baseVectors) {
        positions.push(piece.position.add(vector.applySymmetry(symmetry)));
      }
    }

    for (const position of positions) {
      let move: Partial<Move> = {
        destination: position,
        moveType: MoveType.Move
      }
      if (!board.isOutOfBounds(position)) {
        this.allMoves.push(move);
        if (board.canMoveTo(position, piece, CaptureOptions.OptionalCapture)) {
          move = ObjectUtilities.deepCopy(move);
          this.legalMoves.push(move);
          if (board.canMoveTo(position, piece, CaptureOptions.RequiredCapture)) {
            move = ObjectUtilities.deepCopy(move);
            move.moveType! &= MoveType.Capture
            this.capturableMoves.push(move);

            move = {
              destination: position,
              moveType: MoveType.RangedCapture
            }
            this.capturableMoves.push(move);
          }
        }
      }
    }
  }

}