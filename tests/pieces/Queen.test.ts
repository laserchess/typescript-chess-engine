import { Board, Generator, Move, MoveType, Player } from "@lc/core"
import { BoardVector2d } from "geometry/Vector2d.js"
import { PieceType } from "pieces/Piece.js";

describe("Queen", () => {
  const board = new Board(8, 8);

  describe("movement", () => {
    describe("updateMoves", () => {
      test("No other pieces", () => {
        const queen = Generator.createStandardPiece(
          {
            position: new BoardVector2d(1, 1),
            playerId: Player.White,
            board: board
          },
          PieceType.QUEEN
        )
        const movesLegal: Set<Partial<Move>> = new Set([
          { destination: new BoardVector2d(0, 0), moveType: MoveType.Move },
          { destination: new BoardVector2d(2, 2), moveType: MoveType.Move },
          { destination: new BoardVector2d(3, 3), moveType: MoveType.Move },
          { destination: new BoardVector2d(4, 4), moveType: MoveType.Move },
          { destination: new BoardVector2d(5, 5), moveType: MoveType.Move },
          { destination: new BoardVector2d(6, 6), moveType: MoveType.Move },
          { destination: new BoardVector2d(7, 7), moveType: MoveType.Move },
          { destination: new BoardVector2d(0, 2), moveType: MoveType.Move },
          { destination: new BoardVector2d(2, 0), moveType: MoveType.Move },
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

        queen.movement.updateMoves();
        for (const singleMove of movesLegal) {
          expect(queen.movement.legalMoves).toContainEqual(singleMove);
        }
        expect(queen.movement.illegalMoves.length).toBe(0);
      })
      test("Enemy/friendly piece", () => {
        const queen = Generator.createStandardPiece(
          {
            position: new BoardVector2d(1, 1),
            playerId: Player.White,
            board: board
          },
          PieceType.QUEEN
        )
        const enemyBishop = Generator.createStandardPiece(
          {
            position: new BoardVector2d(6, 6),
            playerId: Player.Black,
            board: board
          },
          PieceType.QUEEN
        )
        // You're my friend now
        const friendlyBishop = Generator.createStandardPiece(
          {
            position: new BoardVector2d(2, 0),
            playerId: Player.White,
            board: board
          },
          PieceType.QUEEN
        )
        const movesLegal: Set<Partial<Move>> = new Set([
          { destination: new BoardVector2d(0, 0), moveType: MoveType.Move },
          { destination: new BoardVector2d(2, 2), moveType: MoveType.Move },
          { destination: new BoardVector2d(3, 3), moveType: MoveType.Move },
          { destination: new BoardVector2d(4, 4), moveType: MoveType.Move },
          { destination: new BoardVector2d(5, 5), moveType: MoveType.Move },
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
          { destination: new BoardVector2d(6, 6), moveType: MoveType.Move | MoveType.Capture },
          // { destination: new BoardVector2d(7, 7), moveType: MoveType.Move },
          { destination: new BoardVector2d(0, 2), moveType: MoveType.Move },
          // { destination: new BoardVector2d(2, 0), moveType: MoveType.Move },
        ])

        const movesIllegal = new Set([
          { destination: new BoardVector2d(7, 7), moveType: MoveType.Move },
          { destination: new BoardVector2d(2, 0), moveType: MoveType.Move },
        ]);

        board.addPiece(enemyBishop);
        board.addPiece(friendlyBishop);
        queen.movement.updateMoves();

        for (const singleMove of movesLegal) {
          expect(queen.movement.legalMoves).toContainEqual(singleMove);
        }
        for (const singleMove of movesIllegal) {
          expect(queen.movement.illegalMoves).toContainEqual(singleMove);
        }

      })
    })
  })
})