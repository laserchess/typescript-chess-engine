import { Board } from "@lc/core";
import { BoardVector2d, Direction } from "@lc/geometry";
import { Piece, PieceOptions } from "@lc/pieces";

export abstract class DirectedPiece extends Piece {
  protected _direction?: Direction;
}