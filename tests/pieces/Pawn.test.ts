import { Board, Generator, Move, MoveType, Player } from "@lc/core"
import { Direction } from "geometry/Direction.js";
import { BoardVector2d } from "geometry/Vector2d.js"
import { PieceType } from "pieces/Piece.js";

describe("Pawn", () => {
  const board = new Board(8, 8);
  test("direction", () => {
    const pawn = Generator.createPawn(
      {
        position: new BoardVector2d(1, 1),
        playerId: Player.White,
        board: board,
        enPassantPosition: new BoardVector2d(1, 4),
        promotionPosition: new BoardVector2d(1, 7),
        direction: Direction.UpperFile
      }
    )
    pawn.direction = Direction.BottomFile;
    expect(pawn.direction).toBe(Direction.BottomFile);
    expect(() => pawn.direction = Direction.UpperLeftDiagonal).toThrow();
  })
  
  test("isOnEnPassantPosition", () => {
    const pawn = Generator.createPawn(
      {
        position: new BoardVector2d(1, 4),
        playerId: Player.White,
        board: board,
        enPassantPosition: new BoardVector2d(1, 4),
        promotionPosition: new BoardVector2d(1, 7),
        direction: Direction.UpperFile
      }
    )
    expect(pawn.isOnEnPassantPosition()).toBeTruthy();

    pawn.enPassantPosition = new BoardVector2d(1, 5);
    expect(pawn.isOnEnPassantPosition()).toBeFalsy();

    pawn.enPassantPosition = undefined as unknown as BoardVector2d;
    expect(() => pawn.enPassantPosition).toThrow()
  })

  test("isOnPromotionPosition", () => {
    const pawn = Generator.createPawn(
      {
        position: new BoardVector2d(1, 7),
        playerId: Player.White,
        board: board,
        enPassantPosition: new BoardVector2d(1, 4),
        promotionPosition: new BoardVector2d(1, 7),
        direction: Direction.UpperFile
      }
    )
    expect(pawn.isOnPromotionPosition()).toBeTruthy();

    pawn.position = new BoardVector2d(2, 7);
    expect(pawn.isOnPromotionPosition()).toBeTruthy();

    pawn.position = new BoardVector2d(2, 6);
    expect(pawn.isOnPromotionPosition()).toBeFalsy();

    pawn.promotionPosition = undefined as unknown as BoardVector2d;
    expect(() => pawn.promotionPosition).toThrow();
  })
  describe("movement", () => {
    describe("updateMoves", () => {
      test("No other pieces", () => {
        const pawn = Generator.createPawn(
          {
            position: new BoardVector2d(1, 1),
            playerId: Player.White,
            board: board,
            enPassantPosition: new BoardVector2d(1, 4),
            promotionPosition: new BoardVector2d(1, 7),
            direction: Direction.UpperFile
          }
        )

        const movesLegal: Set<Partial<Move>> = new Set([
          { destination: new BoardVector2d(1, 2), moveType: MoveType.Move },
          { destination: new BoardVector2d(1, 3), moveType: MoveType.Move },
        ])
        const movesIllegal: Set<Partial<Move>> = new Set(
          [
            { destination: new BoardVector2d(2, 2), moveType: MoveType.Move | MoveType.Capture },
            { destination: new BoardVector2d(0, 2), moveType: MoveType.Move | MoveType.Capture },
            // { destination: new BoardVector2d(2, 2), moveType: MoveType.Move | MoveType.Capture | MoveType.EnPassant },
            // { destination: new BoardVector2d(0, 2), moveType: MoveType.Move | MoveType.Capture | MoveType.EnPassant },
          ]
        )
        pawn.movement.updateMoves();
        for (const singleMove of movesLegal) {
          expect(pawn.movement.legalMoves).toContainEqual(singleMove);
        }
        for (const singleMove of movesIllegal) {
          expect(pawn.movement.illegalMoves).toContainEqual(singleMove);
        }
    })
    test("Enemy pawn",() => {
      const enemyPawn = Generator.createPawn(
        {
          position: new BoardVector2d(2, 6),
          playerId: Player.Black,
          board: board,
          enPassantPosition: new BoardVector2d(2, 3),
          promotionPosition: new BoardVector2d(2, 0),
          direction: Direction.BottomFile
        }
      );
      const enemyPawnOpposite = Generator.createPawn(
        {
          position: new BoardVector2d(1, 6),
          playerId: Player.Black,
          board: board,
          enPassantPosition: new BoardVector2d(1, 3),
          promotionPosition: new BoardVector2d(1, 0),
          direction: Direction.BottomFile
        }
      );
      const pawn = Generator.createPawn(
        {
          position: new BoardVector2d(1, 2),
          playerId: Player.White,
          board: board,
          enPassantPosition: new BoardVector2d(1, 4),
          promotionPosition: new BoardVector2d(1, 7),
          direction: Direction.UpperFile
        }
      );
      
      let move = { destination: new BoardVector2d(2, 6), moveType: MoveType.Move | MoveType.Capture };
      
      board.addPiece(enemyPawn);
      pawn.position = new BoardVector2d(1, 5);
      pawn.movement.updateMoves();
      
      expect(pawn.movement.legalMoves).toContainEqual(move)

      move = { destination: new BoardVector2d(1, 6), moveType: MoveType.Move };

      board.addPiece(enemyPawnOpposite);
      pawn.position = new BoardVector2d(1, 5);
      pawn.movement.updateMoves();
      
      expect(pawn.movement.illegalMoves).toContainEqual(move)
      
    })
    test("Friendly piece",() => {
      const knight = Generator.createStandardPiece(
        {
          position: new BoardVector2d(2, 3),
          playerId: Player.White,
          board: board,
        },
        PieceType.KNIGHT
      );
      const pawn = Generator.createPawn(
        {
          position: new BoardVector2d(1, 2),
          playerId: Player.White,
          board: board,
          enPassantPosition: new BoardVector2d(1, 4),
          promotionPosition: new BoardVector2d(1, 7),
          direction: Direction.UpperFile
        }
      );
      
      const move = { destination: new BoardVector2d(2, 3), moveType: MoveType.Move | MoveType.Capture };
      
      board.addPiece(knight);
      pawn.movement.updateMoves();

      expect(pawn.movement.illegalMoves).toContainEqual(move)


    })
     

      
    })
  })
})