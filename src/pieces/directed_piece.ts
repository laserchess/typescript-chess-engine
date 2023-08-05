import { BoardVector2d } from "geometry";
import { Direction, Piece, PieceOpitons } from "pieces";

export class DirectedPiece extends Piece {
  protected _direction?: Direction;

  public constructor(position: BoardVector2d, playerId: number, board: Board, options: PieceOpitons){
    super(position, playerId, board, options);
  }

  public set direction(direction: Direction) {
    if(this.direction === undefined){
      this._direction = direction;
    }
  }

  public get direction(): Direction | undefined {
    return this._direction;
  }
}