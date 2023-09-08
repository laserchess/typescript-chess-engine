import { BoardVector2d, Rotation } from "@lc/geometry";
import { Piece, PieceType } from "@lc/pieces";

export const enum MoveType {
  Move              = 1 << 0,
  Capture           = 1 << 1,
  RangedCapture     = 1 << 2,
  EnPassant         = 1 << 3,
  KingSideCastling  = 1 << 4,
  QueenSideCastling = 1 << 5,
  Rotation          = 1 << 6,
  Promotion         = 1 << 7,
  
  LaserFired        = 1 << 8,
  Checkmate         = 1 << 9,
  Stalemate         = 1 << 10,
  Lasermate         = 1 << 11,
  Draw              = 1 << 12,
  Check             = 1 << 13,
}

export interface Move {
  destination: BoardVector2d | null,
  moveType: MoveType,
  rotation: Rotation | null,
  
  origin: BoardVector2d,
  promotedTo: PieceType | null
  piece: Piece,
  captured: Piece | null,
  laserFields: [Set<BoardVector2d>, Set<BoardVector2d>],
  laserCaptures: Set<BoardVector2d>
}

export interface MoveOrder {
  origin: BoardVector2d,
  destination: BoardVector2d | null,
  fireLaser: boolean,
  rotation: Rotation | null,
  rangedCapture: boolean
}
