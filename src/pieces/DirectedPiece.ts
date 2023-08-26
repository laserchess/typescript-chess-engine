import { Direction } from "@lc/geometry";
import { Piece} from "@lc/pieces";

export abstract class DirectedPiece extends Piece {
  protected _direction?: Direction;

  public get direction(): Direction | undefined {
    return this._direction;
  }
}