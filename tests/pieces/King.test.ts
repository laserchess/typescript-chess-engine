import { Board, Generator, Move, MoveType, Player } from "@lc/core"
import { BoardVector2d } from "geometry/Vector2d.js"
import { PieceType } from "pieces/Piece.js";

describe("King", () => {
  const board = new Board(8, 8);
  
  describe("movement", () => {
    describe("updateMoves", () => {
      test("No other pieces", () => {
        const king = Generator.createStandardPiece(
          {
            position: new BoardVector2d(1, 1),
            playerId: Player.White,
            board: board
          },
          PieceType.KING
        )

        const movesLegal: Set<Partial<Move>> = new Set([
          { destination: new BoardVector2d(1, 2), moveType: MoveType.Move },
          { destination: new BoardVector2d(2, 2), moveType: MoveType.Move },
          { destination: new BoardVector2d(2, 1), moveType: MoveType.Move },
          { destination: new BoardVector2d(2, 0), moveType: MoveType.Move },
          { destination: new BoardVector2d(1, 0), moveType: MoveType.Move },
          { destination: new BoardVector2d(0, 0), moveType: MoveType.Move },
          { destination: new BoardVector2d(0, 1), moveType: MoveType.Move },
          { destination: new BoardVector2d(0, 2), moveType: MoveType.Move },
        ])
        
        king.movement.updateMoves();
        for (const singleMove of movesLegal) {
          expect(king.movement.legalMoves).toContainEqual(singleMove);
        }
        expect(king.movement.illegalMoves.length).toBe(0);
    })
    test("Enemy piece",() => {
      const king = Generator.createStandardPiece(
        {
          position: new BoardVector2d(1, 1),
          playerId: Player.White,
          board: board
        },
        PieceType.KING
      )
      const enemyKnight = Generator.createStandardPiece(
        {
          position: new BoardVector2d(2, 2),
          playerId: Player.Black,
          board: board
        },
        PieceType.KNIGHT
      );
     
      
      const move = { destination: new BoardVector2d(2, 2), moveType: MoveType.Move | MoveType.Capture };
      
      board.addPiece(enemyKnight);

      king.movement.updateMoves();

      expect(king.movement.legalMoves).toContainEqual(move);
      
    })
    
    test("Friendly piece",() => {
      const king = Generator.createStandardPiece(
        {
          position: new BoardVector2d(1, 1),
          playerId: Player.White,
          board: board
        },
        PieceType.KING
      )
      const friendlyKnight = Generator.createStandardPiece(
        {
          position: new BoardVector2d(2, 2),
          playerId: Player.White,
          board: board
        },
        PieceType.KNIGHT
      );
     
      
      const move = { destination: new BoardVector2d(2, 2), moveType: MoveType.Move };
      
      board.addPiece(friendlyKnight);

      king.movement.updateMoves();

      expect(king.movement.illegalMoves).toContainEqual(move);


    })
    })
  })
})