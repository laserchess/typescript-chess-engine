import { Board } from "@lc/core";
import { BoardVector2d, Direction } from "@lc/geometry";
import { Piece, PieceOptions } from "@lc/pieces";

export class DirectedPiece extends Piece {
  protected _direction?: Direction;

  public constructor(position: BoardVector2d, playerId: number, board: Board, options: PieceOptions) {
    super(position, playerId, board, options);
  }
}