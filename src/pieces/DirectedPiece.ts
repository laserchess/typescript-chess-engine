import { BoardVector2d } from "geometry";
import { Direction, Piece, PieceOpitons } from "pieces";

export class DirectedPiece extends Piece {
  public direction?: Direction;

  public constructor(position: BoardVector2d, playerId: number, board: Board, options: PieceOpitons) {
    super(position, playerId, board, options);
  }
}