import { BoardVector2d, Rotation } from "@lc/geometry";
import { Piece, PieceType } from "@lc/pieces";
import { ObjectsUtilities } from "utils/ObjectUtilities.js";

export const enum MoveType {
  Move              = 1 << 0,
  Capture           = 1 << 1,
  RangedCapture     = 1 << 2,
  EnPassant         = 1 << 3,
  KingSideCastling  = 1 << 4,
  QueenSideCastling = 1 << 5,
  Rotation          = 1 << 6,
  Promotion         = 1 << 7,
  Check             = 1 << 8,
  Checkmate         = 1 << 9,
  Stalemate         = 1 << 10,
  Draw              = 1 << 11,
  Lasermate         = 1 << 12,
  LaserFired        = 1 << 13,
  LaserCooldown     = 1 << 14
}

export interface Move {
  origin: BoardVector2d,
  destination: BoardVector2d,
  moveType: MoveType,
  rotation: Rotation | null
  promotedTo: PieceType | null
  piece: Piece,
  captured: Piece | null,
}


