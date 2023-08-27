import { Move } from "@lc/core";
import { NotImplementedError } from "@lc/utils";
import { BoardVector2d, Direction } from "@lc/geometry";
import { Piece } from "@lc/pieces";

export class LongRangeMovement /** extends PieceMovement */ {
  // All moves but grouped by its direction.
  public allLongRangeMoves: Partial<Record<Direction, Partial<Move>>> = {};

  constructor(ranged: Piece) {

  }

  public iterateSquares(origin: BoardVector2d) {
    throw new NotImplementedError("iterateSquares() method is not implemented yet");
  }

  public getAllMoves(): BoardVector2d[][] {
    throw new NotImplementedError("getAllMoves() method is not implemented yet");
  }

  public getLegalMoves(): BoardVector2d[][] {
    throw new NotImplementedError("getLegalMoves() method is not implemented yet");
  }
}