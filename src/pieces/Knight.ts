import { Board, CaptureOptions, Move, MoveType } from "@lc/core";
import { BoardVector2d, Symmetry } from "@lc/geometry";
import { Piece, PieceOptions, PieceType } from "@lc/pieces";
import { PieceMovement } from "@lc/piece-movements";
import { ObjectsUtilities } from "utils/ObjectUtilities.js";

export class Knight extends Piece {
  protected override initType(): void {
    this.pieceType = PieceType.KNIGHT;
    this.movement  = new KnightMovement(this, this.board);
  }

  public rangedCapture(destination: BoardVector2d) {
    this._position = destination;
    this.moveCounter += 1;
    this.board.notifyRangedCapture(this.position, destination);
  }
}

export class KnightMovement extends PieceMovement {


  protected updateMovesWrapped(): void {
    const piece: Knight = this.piece as Knight;
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
        this.allMoves.push(move);
        if (board.canMoveTo(position, piece, CaptureOptions.OptionalCapture)) {
          move = ObjectsUtilities.objectDeepcopy(move);
          this.legalMoves.push(move);
          if (board.canMoveTo(position, piece, CaptureOptions.RequiredCapture)) {
            move = ObjectsUtilities.objectDeepcopy(move);
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