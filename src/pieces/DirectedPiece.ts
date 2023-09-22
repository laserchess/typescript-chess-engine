import { Direction } from "@lc/geometry";
import { Piece } from "@lc/pieces";

export abstract class DirectedPiece extends Piece {
  protected _direction?: Direction;

  public get direction(): Direction {
    if (this._direction === undefined) {
      throw new Error("Direction is undeifned.");
    }
    return this._direction;
  }
}
