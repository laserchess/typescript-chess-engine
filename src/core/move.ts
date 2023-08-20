import { BoardVector2d } from "geometry";
import { Rotation } from "geometry/Direction.js";
import { Piece } from "pieces";

export const enum MoveType {
  Move              = 1 << 0,
  Capture           = 1 << 1,
  KingSideCastling  = 1 << 2,
  QueenSideCastling = 1 << 3,
  Promotion         = 1 << 4,
  Check             = 1 << 5,
  Checkmate         = 1 << 6,
  Stalemate         = 1 << 7,
  Draw              = 1 << 8,
  Rotation          = 1 << 9,
  Lasermate         = 1 << 10,
  LaserFired        = 1 << 11,
  LaserCooldown     = 1 << 12
}

export interface Move {
  piece: Piece,
  origin: BoardVector2d,
  destination: BoardVector2d,
  captured: Piece,
  moveType: MoveType,
  rotation: Rotation
}
