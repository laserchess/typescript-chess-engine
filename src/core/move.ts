import { BoardVector2d, Rotation } from "@lc/geometry";
import { Piece } from "@lc/pieces";

export const enum PieceMoveType {
  Move              = 1 << 0,
  Capture           = 1 << 1,
  RangedCapture     = 1 << 2,
  EnPassant         = 1 << 3,
  KingSideCastling  = 1 << 4,
  QueenSideCastling = 1 << 5,
  Promotion         = 1 << 6,
  Rotation          = 1 << 7
}

export const enum BoardMoveType {
  Check             = 1 << 8,
  Checkmate         = 1 << 9,
  Stalemate         = 1 << 10,
  Draw              = 1 << 11,
  Lasermate         = 1 << 12,
  LaserFired        = 1 << 13,
  LaserCooldown     = 1 << 14
}

export interface Move {
  piece: Piece,
  origin: BoardVector2d,
  destination: BoardVector2d,
  captured: Piece,
  moveType: PieceMoveType & BoardMoveType,
  rotation: Rotation
}
