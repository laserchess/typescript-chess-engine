import { Direction } from "@lc/geometry";
import { Piece, PieceType } from "@lc/pieces";
import { LongRangeMovement } from "@lc/piece-movements";

export class Bishop extends Piece {
  public static DIRECTIONS = [
    Direction.UpperRightDiagonal,
    Direction.BottomRightDiagonal,
    Direction.BottomLeftDiagonal,
    Direction.UpperLeftDiagonal
  ];

  protected override initType(): void {
    this._type     = PieceType.BISHOP;
    this._movement = new LongRangeMovement(this, this.board, Bishop.DIRECTIONS);
  }
}
