import { Board } from "core/Board.js";
import { BoardVector2d, Direction } from "geometry";
import { Piece, PieceOpitons } from "pieces";

export class DirectedPiece extends Piece {
  protected _direction?: Direction;

  public constructor(position: BoardVector2d, playerId: number, board: Board, options: PieceOpitons) {
    super(position, playerId, board, options);
  }
}