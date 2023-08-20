import { Board } from "core/Board.js";
import { BoardVector2d, Direction } from "@lc/geometry";
import { Piece, PieceOpitons } from "@lc/pieces";

export class DirectedPiece extends Piece {
  protected _direction?: Direction;

  public constructor(position: BoardVector2d, playerId: number, board: Board, options: PieceOpitons) {
    super(position, playerId, board, options);
  }
}