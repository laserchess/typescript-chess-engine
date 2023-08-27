import { Direction } from "geometry/Direction.js";
import { Piece, PieceType } from "./Piece.js";
import { LongRangeMovement } from "./movements/LongRangeMovement.js";

export class Queen extends Piece {
  public static DIRECTIONS = [
    Direction.UpperFile,
    Direction.UpperRightDiagonal,
    Direction.RightRank,
    Direction.BottomRightDiagonal,
    Direction.BottomFile,
    Direction.BottomLeftDiagonal,
    Direction.LeftRank,
    Direction.UpperLeftDiagonal
  ];

  protected override initType(): void {
    this._type     = PieceType.QUEEN;
    this._movement = new LongRangeMovement(this, this.board, Queen.DIRECTIONS);
  }
}
