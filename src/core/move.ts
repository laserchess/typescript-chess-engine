import { BoardVector2d, Rotation } from "@lc/geometry";
import { Piece, PieceType } from "@lc/pieces";

export const enum MoveType {
  Move              = 1 << 0,
  Capture           = 1 << 1,
  KingSideCastling  = 1 << 2,
  QueenSideCastling = 1 << 3,
  Promotion         = 1 << 4,
  EnPassant         = 1 << 5,
  Rotation          = 1 << 6,
  RangedCapture     = 1 << 7
}

export const enum BoardMoveType {
  Check             = 1 << 8,
  Checkmate         = 1 << 9,
  Stalemate         = 1 << 10,
  Draw              = 1 << 11,
  Lasermate         = 1 << 12,
  LaserFired        = 1 << 13,
  LaserCooldown     = 1 << 14,
}

export interface SendableMove {
  origin: BoardVector2d,
  destination: BoardVector2d,
  moveType: MoveType & BoardMoveType,
  rotation: Rotation
  promotedTo: PieceType
}

export interface MoveAdditionalData {
  piece: Piece,
  captured: Piece,
}

export type Move = MoveAdditionalData & SendableMove

export namespace Move {
  export function createSendableMove(move: Move): SendableMove {
    const sendableMove: SendableMove = move;
    return sendableMove;
  }
}
