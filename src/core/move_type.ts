export const enum PieceMoveType {
  Move = 1 << 0,
  Capture = 1 << 1,
  KingSideCastling = 1 << 2,
  QueebSideCastling = 1 << 3,
  Promotion = 1 << 4,
  Check = 1 << 5,
  Checkmate = 1 << 6,
  Stalemate = 1 << 7,
  Draw = 1 << 8,
  Rotation = 1 << 9,
  Lasermate = 1 << 10,
  LaserFired = 1 << 11,
  LaserCooldown = 1 << 12
}