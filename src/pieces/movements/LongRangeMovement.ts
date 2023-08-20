import { NotImplementedError } from "utils/error.js";
import { BoardVector2d, Direction } from "@lc/geometry";
import { Piece } from "@lc/pieces";

export class LongRangeMovement /** extends PieceMovement */ {
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