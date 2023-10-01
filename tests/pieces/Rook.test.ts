import { Board, Generator, Move, MoveType, Player } from "@lc/core"
import { BoardVector2d } from "geometry/Vector2d.js"
import { PieceType } from "pieces/Piece.js";

describe("Rook", () => {
  const board = new Board(8, 8);

  describe("movement", () => {
    describe("updateMoves", () => {
      test("No other pieces", () => {
        const rook = Generator.createStandardPiece(
          {
            position: new BoardVector2d(1, 1),
            playerId: Player.White,
            board: board
          },
          PieceType.ROOK
        )
        const movesLegal: Set<Partial<Move>> = new Set([
          { destination: new BoardVector2d(1, 0), moveType: MoveType.Move },
          { destination: new BoardVector2d(1, 2), moveType: MoveType.Move },
          { destination: new BoardVector2d(1, 3), moveType: MoveType.Move },
          { destination: new BoardVector2d(1, 4), moveType: MoveType.Move },
          { destination: new BoardVector2d(1, 5), moveType: MoveType.Move },
          { destination: new BoardVector2d(1, 6), moveType: MoveType.Move },
          { destination: new BoardVector2d(1, 7), moveType: MoveType.Move },
          { destination: new BoardVector2d(0, 1), moveType: MoveType.Move },
          { destination: new BoardVector2d(2, 1), moveType: MoveType.Move },
          { destination: new BoardVector2d(3, 1), moveType: MoveType.Move },
          { destination: new BoardVector2d(4, 1), moveType: MoveType.Move },
          { destination: new BoardVector2d(5, 1), moveType: MoveType.Move },
          { destination: new BoardVector2d(6, 1), moveType: MoveType.Move },
          { destination: new BoardVector2d(7, 1), moveType: MoveType.Move },
        ])

        rook.movement.updateMoves();
        for (const singleMove of movesLegal) {
          expect(rook.movement.legalMoves).toContainEqual(singleMove);
        }
        expect(rook.movement.illegalMoves.length).toBe(0);
      })
      test("Enemy/friendly piece", () => {
        const rook = Generator.createStandardPiece(
          {
            position: new BoardVector2d(1, 1),
            playerId: Player.White,
            board: board
          },
          PieceType.ROOK
        )
        const enemyRook = Generator.createStandardPiece(
          {
            position: new BoardVector2d(6, 1),
            playerId: Player.Black,
            board: board
          },
          PieceType.ROOK
        )
        // You're my friend now
        const friendlyRook = Generator.createStandardPiece(
          {
            position: new BoardVector2d(1, 6),
            playerId: Player.White,
            board: board
          },
          PieceType.ROOK
        )
        const movesLegal: Set<Partial<Move>> = new Set([
          { destination: new BoardVector2d(1, 0), moveType: MoveType.Move },
          { destination: new BoardVector2d(1, 2), moveType: MoveType.Move },
          { destination: new BoardVector2d(1, 3), moveType: MoveType.Move },
          { destination: new BoardVector2d(1, 4), moveType: MoveType.Move },
          { destination: new BoardVector2d(1, 5), moveType: MoveType.Move },
          // { destination: new BoardVector2d(1, 6), moveType: MoveType.Move },
          // { destination: new BoardVector2d(1, 7), moveType: MoveType.Move },
          { destination: new BoardVector2d(0, 1), moveType: MoveType.Move },
          { destination: new BoardVector2d(2, 1), moveType: MoveType.Move },
          { destination: new BoardVector2d(3, 1), moveType: MoveType.Move },
          { destination: new BoardVector2d(4, 1), moveType: MoveType.Move },
          { destination: new BoardVector2d(5, 1), moveType: MoveType.Move },
          { destination: new BoardVector2d(6, 1), moveType: MoveType.Move | MoveType.Capture },
        ])

        const movesIllegal = new Set([
          { destination: new BoardVector2d(7, 1), moveType: MoveType.Move },
          { destination: new BoardVector2d(1, 6), moveType: MoveType.Move },
          { destination: new BoardVector2d(1, 7), moveType: MoveType.Move },
        ]);

        board.addPiece(enemyRook);
        board.addPiece(friendlyRook);
        rook.movement.updateMoves();

        for (const singleMove of movesLegal) {
          expect(rook.movement.legalMoves).toContainEqual(singleMove);
        }
        for (const singleMove of movesIllegal) {
          expect(rook.movement.illegalMoves).toContainEqual(singleMove);
        }

      })
    })
  })
})