import { Direction } from "@lc/geometry";
import { Piece, PieceType } from "@lc/pieces";
import { LongRangeMovement } from "@lc/piece-movements";

export class Rook extends Piece {
  public static DIRECTIONS = [
    Direction.UpperFile,
    Direction.RightRank,
    Direction.BottomFile,
    Direction.LeftRank,
  ];

  protected override initType(): void {
    this._type = PieceType.ROOK;
    this._movement = new LongRangeMovement(this, this.board, Rook.DIRECTIONS);
  }
}
