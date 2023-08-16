export const enum PieceMoveType {
  MOVE = 1 << 0,
  CAPTURE = 1 << 1,
  KING_SIDE_CASTLING = 1 << 2,
  QUEEN_SIDE_CASTLING = 1 << 3,
  PROMOTION = 1 << 4,
  CHECK = 1 << 5,
  CHECKMATE = 1 << 6,
  STALEMATE = 1 << 7,
  DRAW = 1 << 8,
  ROTATION = 1 << 9,
  LASER_MATE = 1 << 10,
  LASER_FIRED = 1 << 11,
  LASER_HOLD = 1 << 12
}