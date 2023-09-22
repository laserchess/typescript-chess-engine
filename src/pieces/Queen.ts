import { Direction } from "@lc/geometry";
import { Piece, PieceType } from "@lc/pieces";
import { LongRangeMovement } from "@lc/piece-movements";

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
    this._type = PieceType.QUEEN;
    this._movement = new LongRangeMovement(this, this.board, Queen.DIRECTIONS);
  }
}
